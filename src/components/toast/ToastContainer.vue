<script setup>
import { useToast } from '../../composables/useToast.js'
import Toast from './Toast.vue'
import { TransitionGroup } from 'vue'

const { toasts, removeToast } = useToast()
</script>

<template>
  <TransitionGroup name="toast" tag="div" class="toast-container">
    <Toast v-for="toast in toasts" :key="toast.id" :toast="toast" @close="removeToast" />
  </TransitionGroup>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.toast-move {
  transition: transform 0.25s ease;
}
</style>
