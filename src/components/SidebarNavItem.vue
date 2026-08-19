<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  icon: {
    type: [Object, Function],
    required: true,
  },
  iconSize: {
    type: Number,
    default: 20,
  },
  to: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <RouterLink class="sidebar-nav-item" exact-active-class="active" :to="to">
    <component :is="icon" :size="iconSize" />

    <span>{{ title }}</span>
  </RouterLink>
</template>
