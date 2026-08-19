<script setup>
import BaseSkeleton from '../base/BaseSkeleton.vue'

const { rows } = defineProps({
  rows: {
    type: Number,
    default: 5,
  },
})

const columns = 7 // Assuming there are 7 columns in the product table
</script>

<template>
  <div class="data-table-skeleton">
    <div class="data-table-skeleton__header">
      <BaseSkeleton v-for="col in columns" :key="col" width="100%" height="20px" />
    </div>

    <div v-for="row in rows" :key="row" class="data-table-skeleton__row">
      <BaseSkeleton v-for="col in columns" :key="col" width="100%" height="20px" />
    </div>
  </div>
</template>
