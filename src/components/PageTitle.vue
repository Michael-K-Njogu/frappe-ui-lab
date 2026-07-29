<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div class="page-title">
    <h1>{{ title }}</h1>

    <div class="page-actions">
      <slot name="actions" />
    </div>
  </div>
</template>