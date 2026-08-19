<script setup>
import BaseBadge from '../base/BaseBadge.vue'
import BaseFormSection from '../base/BaseFormSection.vue'
import { formatCurrency } from '../../utils/formatters'
import { PRODUCT_STATUS } from '../../constants/productStatuses'

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
})

function statusVariant(status) {
  switch (status) {
    case PRODUCT_STATUS.ACTIVE:
      return 'success'

    case PRODUCT_STATUS.INACTIVE:
      return 'danger'

    default:
      return 'neutral'
  }
}

function formatStock(product) {
  if (!product.unit) {
    return product.stockQuantity
  }

  const unit = product.stockQuantity === 1 ? product.unit : `${product.unit}s`

  return `${product.stockQuantity} ${unit}`
}
</script>

<template>
  <div class="card">
    <h2 class="text-2xl font-bold mb-4">{{ product.name }}</h2>
    <div class="mb-2"><strong>Price:</strong> {{ formatCurrency(product.price) }}</div>
    <div class="mb-2"><strong>Stock Quantity:</strong> {{ formatStock(product) }}</div>
    <div class="mb-2">
      <strong>Status:</strong>
      <BaseBadge :label="product.status" :variant="statusVariant(product.status)" />
    </div>
  </div>
</template>
