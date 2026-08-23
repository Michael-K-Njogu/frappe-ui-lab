<script setup>
import { onMounted } from 'vue'

import { useAuth } from './composables/useAuth'

import ToastContainer from './components/toast/ToastContainer.vue'

const { initialize } = useAuth()

onMounted(async () => {
  try {
    await initialize()

    const { user, session, isAuthenticated } = useAuth()

    console.log('User:', user.value)
    console.log('Session:', session.value)
    console.log('Authenticated:', isAuthenticated.value)
  } catch (err) {
    console.error('Auth initialization failed:', err)
  }
})
</script>

<template>
  <RouterView />
  <ToastContainer />
</template>
