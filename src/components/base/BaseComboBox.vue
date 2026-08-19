<script setup>
// Props
defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  options: {
    type: Array,
    default: () => [],
  },
  placeholder: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <select :value="modelValue" @change="$emit('update:modelValue', $event.target.value)">
    <option value="" disabled selected hidden>{{ placeholder }}</option>
    <option v-for="option in options" :key="option.value" :value="option.value">
      {{ option.label }}
    </option>
  </select>
</template>
