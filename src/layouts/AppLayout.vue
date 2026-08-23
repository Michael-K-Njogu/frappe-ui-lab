<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { useAuth } from '../composables/useAuth'
import { useToast } from '../composables/useToast'

import AppSidebarNav from '../components/AppSidebarNav.vue'
import NotificationMenu from '../components/notifications/NotificationMenu.vue'
import UserMenu from '../components/user/UserMenu.vue'

const router = useRouter()

const { signOut } = useAuth()

const { success, error: showError } = useToast()

const signingOut = ref(false)

async function handleSignOut() {
  signingOut.value = true

  try {
    await signOut()

    success('Signed out successfully.')

    await router.replace({
      name: 'login',
    })
  } catch (err) {
    console.error('Sign out failed:', err)

    showError(err.message || 'Unable to sign out. Please try again.')
  } finally {
    signingOut.value = false
  }
}
</script>

<template>
  <div class="layout">
    <AppSidebarNav />
    <main class="main-content">
      <header class="top-bar-header">
        <div class="top-bar-header-left"></div>
        <div class="top-bar-header-right">
          <NotificationMenu
            @view-all="
              router.push({
                name: 'notifications',
              })
            "
          />
          <UserMenu @sign-out="handleSignOut" />
        </div>
      </header>
      <div class="content">
        <RouterView />
      </div>
    </main>
  </div>
</template>
