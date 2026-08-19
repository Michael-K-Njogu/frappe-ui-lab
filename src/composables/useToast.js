import { reactive } from 'vue'

const state = reactive({
  toasts: [],
})

const TOAST_DURATION = {
  success: 3000,
  error: 0, // Stay visible until dismissed
  warning: 0, // Stay visible until dismissed
  info: 3000,
}

export function useToast() {
  function addToast({ message, type, title = '', dismissable = true, duration = 3000 }) {
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
      duration: TOAST_DURATION.success,
      ...options,
    })
  }

  function error(message, options = {}) {
    addToast({
      message,
      type: 'error',
      duration: TOAST_DURATION.error,
      ...options,
    })
  }

  function warning(message, options = {}) {
    addToast({
      message,
      type: 'warning',
      duration: TOAST_DURATION.warning,
      ...options,
    })
  }

  function info(message, options = {}) {
    addToast({
      message,
      type: 'info',
      duration: TOAST_DURATION.info,
      ...options,
    })
  }

  function removeToast(id) {
    const index = state.toasts.findIndex((toast) => toast.id === id)

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
