<script setup>
import { onMounted } from 'vue'
import { usePermissions } from './composables/usePermissions'
import { useAuth } from './composables/useAuth'

import ToastContainer from './components/toast/ToastContainer.vue'

const { initialize, user, profile } = useAuth()
const { role, permissions } = usePermissions()

onMounted(async () => {
  await initialize()
})
</script>

<template>
  <RouterView />
  <ToastContainer />
</template>
