<script setup>
import { ArrowLeft, ChevronLeft } from '@lucide/vue'

defineProps({
  title: {
    type: String,
    required: true,
  },
  hasBackButton: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <div class="page-title">
    <div class="title-section">
      <button v-if="hasBackButton" class="btn-secondary back-button" @click="$router.back()">
        <ChevronLeft size="36" stroke-width="3" />
      </button>
      <h1>{{ title }}</h1>
    </div>

    <div class="page-actions">
      <slot name="actions" />
    </div>
  </div>
</template>
