<script setup>
defineProps({
  label: {
    type: String,
    default: '',
  },
  variant: {
    type: String,
    default: 'primary',
  },
  type: {
    type: String,
    default: 'button',
  },
  ariaLabel: {
    type: String,
    default: '',
  },
  size: {
    type: String,
    default: '',
  },
  loading: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <button :type="type" :class="`btn btn-${variant} btn-${size}`">
    <slot name="icon" />
    {{ label }}
  </button>
</template>
