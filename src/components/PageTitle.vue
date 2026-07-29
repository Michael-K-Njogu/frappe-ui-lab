<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  actionTitle: {
    type: String,
    default: 'Action',
  },
  actionType: {
    type: String,
    default: 'primary',
  },
  actionIcon: {
    type: [Object, Function],
    default: null,
  },
  to: {
    type: [String, Object],
    default: '',
  },
})
</script>

<template>
  <div class="page-title">
    <h1>{{ title }}</h1>

    <RouterLink
      v-if="to"
      :to="to"
      :class="`btn btn-${actionType}`"
    >
        <component v-if="actionIcon" :is="actionIcon" class="action-icon" />
        <span>{{ actionTitle }}</span>
    </RouterLink>
  </div>
</template>