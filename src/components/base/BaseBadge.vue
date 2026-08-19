<script setup>
defineProps({
  variant: {
    type: String,
    default: 'default',
  },
  size: {
    type: String,
    default: 'sm',
  },
})
</script>

<template>
  <span class="badge" :class="`badge--${variant.toLowerCase()} badge-${size.toLowerCase()}`">
    <slot />
  </span>
</template>
