<script setup>
const props = defineProps({
  width: {
    type: String,
    default: '100%',
  },
  height: {
    type: String,
    default: '1rem',
  },
})
</script>

<template>
  <div
    class="skeleton"
    :style="{
      width: props.width,
      height: props.height,
    }"
  ></div>
</template>
