<script setup>
import { ORDER_STATUS, ORDER_STATUS_OPTIONS } from '../../constants/orderStatuses.js'
import { formatCurrency, formatDate } from '../../utils/formatters.js'

import BaseBadge from '../base/BaseBadge.vue'
import { Calendar } from '@lucide/vue'

defineProps({
  order: {
    type: Object,
    required: true,
  },

  summary: {
    type: Object,
    default: () => ({
      totalItems: 0,
      subtotal: 0,
      totalDiscount: 0,
      grandTotal: 0,
    }),
  },
})
</script>

<template>
  <div class="card">
    <div class="card-header">
      <h3 class="card-title">Order Summary</h3>
      <BaseBadge :variant="order.status" size="md">
        {{ ORDER_STATUS_OPTIONS[order.status] || order.status }}
      </BaseBadge>
    </div>

    <div class="icon-detail">
      <div class="icon">
        <Calendar size="20" />
      </div>
      <div class="detail">
        <h6>Order Date:</h6>
        <p>{{ formatDate(order.createdAt) }}</p>
      </div>
    </div>
    <div class="mb-2"><strong>Last Updated:</strong> {{ formatDate(order.updatedAt) }}</div>

    <div class="order-summary">
      <div class="order-summary-item">
        <span>Total Items</span>
        <strong>{{ summary.totalItems }}</strong>
      </div>

      <div class="summary-row">
        <span>Subtotal</span>
        <strong>{{ formatCurrency(summary.subtotal) }}</strong>
      </div>

      <div class="summary-row">
        <span>Discount</span>
        <strong>{{ formatCurrency(summary.totalDiscount) }}</strong>
      </div>

      <div class="summary-row summary-total">
        <span>Grand Total</span>
        <strong>{{ formatCurrency(summary.grandTotal) }}</strong>
      </div>
    </div>
  </div>
</template>
