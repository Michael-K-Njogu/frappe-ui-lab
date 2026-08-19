<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  value: {
    type: [String, Number],
    required: true,
  },
})
</script>

<template>
  <div class="dashboard-stat-card">
    <div class="dashboard-stat-card__icon">
      <slot name="icon"></slot>
    </div>

    <div class="dashboard-stat-card__content">
      <h3 class="dashboard-stat-card__title">
        <slot name="title"></slot>
      </h3>

      <p class="dashboard-stat-card__value">
        <slot name="value"></slot>
      </p>
    </div>

    <div class="dashboard-stat-card__footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>
