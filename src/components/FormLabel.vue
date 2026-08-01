<script setup>
defineProps({
  label: {
    type: String,
    required: true,
  },
  for: {
    type: String,
    required: true,
  },
  required: {
    type: Boolean,
    default: false,
  },
  inline: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <label :for="for" :class="['form-label', { 'form-label__inline': inline }]">
    {{ label }}
    <span v-if="required" class="required">*</span>
  </label>
</template>