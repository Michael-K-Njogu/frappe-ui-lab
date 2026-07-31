import { reactive } from 'vue'

const state = reactive({
  toasts: [],
})

export function useToast() {

  function addToast({
    message,
    type,
    title = '',
    duration = 3000,
    dismissable = true,
  }) {
    state.toasts.push({
      id: crypto.randomUUID(),
      message,
      type,
      title,
      duration,
      dismissable,
    })
  }

  function success(message, options = {}) {
    addToast({ 
      message, 
      type: 'success',
      ...options
    })
  }

  function error(message, options = {}) {
    addToast({ 
      message, 
      type: 'error', 
      ...options 
    })
  }

  function info(message, options = {}) {
    addToast({ 
      message, 
      type: 'info', 
      ...options 
    })
  }

  function warning(message, options = {}) {
    addToast({ 
      message, 
      type: 'warning', 
      ...options 
    })
  }

  function removeToast(id) {
    state.toasts = state.toasts.filter(
      toast => toast.id !== id
    )
  }

  return {
    toasts: state.toasts,
    addToast,
    removeToast,
    success,
    error,
    info,
    warning,
  }
}