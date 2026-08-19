<script setup>
import { useToast } from '../../composables/useToast'
import { computed } from 'vue'
import { CircleCheck, X, CircleAlert, Info, TriangleAlert, CircleX } from '@lucide/vue'

const props = defineProps({
  toast: {
    type: Object,
    required: true,
  },
})

const toastIcon = computed(() => {
  switch (props.toast.type) {
    case 'success':
      return CircleCheck
    case 'error':
      return CircleAlert
    case 'warning':
      return TriangleAlert
    case 'info':
      return Info
    default:
      return null
  }
})

const { removeToast } = useToast()
</script>

<template>
  <div class="toast" :class="`toast--${toast.type}`">
    <div class="toast__header">
      <component :is="toastIcon" class="toast__icon" :size="18" />

      <div class="toast__content">
        <h4 v-if="toast.title" class="toast__title">
          {{ toast.title }}
        </h4>

        <p class="toast__message">
          {{ toast.message }}
        </p>
      </div>

      <button v-if="toast.dismissable" class="toast__close" @click="removeToast(toast.id)">
        <X :size="16" />
      </button>
    </div>
  </div>
</template>
