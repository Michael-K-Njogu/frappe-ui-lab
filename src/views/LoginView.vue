<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'

import { signIn } from '../services/authService'
import { useToast } from '../composables/useToast'

import BaseTextInput from '../components/base/BaseTextInput.vue'
import BaseButton from '../components/base/BaseButton.vue'

const route = useRoute()
const router = useRouter()

const { success, error: showError } = useToast()

const loading = ref(false)

const loginSchema = toTypedSchema(
  z.object({
    email: z.string().min(1, 'Email is required.').email('Enter a valid email address.'),

    password: z.string().min(1, 'Password is required.'),
  }),
)

const { defineField, errors, handleSubmit } = useForm({
  validationSchema: loginSchema,
  initialValues: {
    email: '',
    password: '',
  },
})

const fields = {
  email: defineField('email')[0],
  password: defineField('password')[0],
}

const redirectPath = computed(() => {
  const redirect = route.query.redirect

  return typeof redirect === 'string' && redirect.startsWith('/') ? redirect : '/'
})

const handleLogin = handleSubmit(async (values) => {
  loading.value = true

  try {
    await signIn(values.email, values.password)

    success('Signed in successfully.')

    await router.replace(redirectPath.value)
  } catch (err) {
    console.error('Login failed:', err)

    showError(err.message || 'Unable to sign in. Please check your credentials.')
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <main class="login-page">
    <section class="login-card" aria-labelledby="login-title">
      <div class="login-header">
        <h1 id="login-title">Welcome back</h1>

        <p>Sign in to continue to your account.</p>
      </div>

      <form class="login-form" @submit="handleLogin">
        <div class="form-group">
          <BaseTextInput
            id="email"
            name="email"
            type="email"
            label="Email address"
            autocomplete="email"
            v-model="fields.email.value"
            :error="errors.email"
            placeholder="Enter your email"
          />

          <p v-if="errors.email" class="invalid">
            {{ errors.email }}
          </p>
        </div>

        <div class="form-group">
          <BaseTextInput
            id="password"
            name="password"
            type="password"
            label="Password"
            autocomplete="current-password"
            v-model="fields.password.value"
            :error="errors.password"
            placeholder="Enter your password"
          />

          <p v-if="errors.password" class="invalid">
            {{ errors.password }}
          </p>
        </div>

        <BaseButton
          label="Sign In"
          type="submit"
          variant="primary"
          :loading="loading"
          :disabled="loading"
        />
      </form>
    </section>
  </main>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 1.5rem;
}

.login-card {
  width: 100%;
  max-width: 26rem;
  padding: 2rem;
  border: 1px solid var(--border-color-default);
  border-radius: 4px;
  background: var(--bg-colour-white);
  box-shadow: var(--shadow-default);
}

.login-header {
  margin-bottom: 2rem;
}

.login-header h1 {
  margin: 0 0 0.5rem;
}

.login-header p {
  margin: 0;
  color: var(--text-secondary);
}

.login-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.invalid {
  margin: 0;
  font-size: 0.875rem;
  color: var(--text-colour-danger);
}
</style>
