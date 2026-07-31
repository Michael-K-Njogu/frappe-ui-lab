import { reactive } from 'vue'

const state = reactive({
  toasts: [],
})

export function useToast() {

  function addToast({
    message,
    type,
    title = '',
    dismissable = true,
    duration = 3000,
  }) {

    const toast = {
      id: crypto.randomUUID(),
      title,
      message,
      type,
      dismissable,
      duration,
    }

    state.toasts.push(toast)

    // Auto-dismiss
    if (toast.duration > 0) {
      setTimeout(() => {
        removeToast(toast.id)
      }, toast.duration)
    }
  }

  function success(message, options = {}) {
    addToast({
      message,
      type: 'success',
      duration: 3000,
      ...options,
    })
  }

  function error(message, options = {}) {
    addToast({
      message,
      type: 'error',
      duration: 0, // Stay visible until dismissed
      ...options,
    })
  }

  function warning(message, options = {}) {
    addToast({
      message,
      type: 'warning',
      duration: 0,
      ...options,
    })
  }

  function info(message, options = {}) {
    addToast({
      message,
      type: 'info',
      duration: 3000,
      ...options,
    })
  }

  function removeToast(id) {
    const index = state.toasts.findIndex(
      toast => toast.id === id
    )

    if (index !== -1) {
      state.toasts.splice(index, 1)
    }
  }

  return {
    toasts: state.toasts,
    removeToast,
    success,
    error,
    warning,
    info,
  }
}