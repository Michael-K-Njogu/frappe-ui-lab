<script setup>
import { ORDER_STATUS_OPTIONS } from '../../constants/orderStatuses.js'
import { formatCurrency, formatDate } from '../../utils/formatters.js'

import BaseBadge from '../base/BaseBadge.vue'
import { Calendar, Package, ReceiptText, RefreshCcw, Tag } from '@lucide/vue'

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
  <div class="order-card card">
    <div class="card-header">
      <h3 class="card-title">Order Summary</h3>
    </div>

    <div class="order-card-meta">
      <div class="order-meta-item">
        <Calendar size="18" class="order-meta-icon" />

        <div>
          <span class="order-meta-label">Created At</span>

          <strong class="order-meta-value">
            {{ formatDate(order.createdAt) }}
          </strong>
        </div>
      </div>

      <div class="order-meta-item">
        <RefreshCcw size="18" class="order-meta-icon" />
        <div>
          <span class="order-meta-label"> Last updated </span>

          <strong class="order-meta-value">
            {{ formatDate(order.updatedAt) }}
          </strong>
        </div>
      </div>

      <div class="order-meta-item">
        <ReceiptText size="18" class="order-meta-icon" />
        <div>
          <span class="order-meta-label"> Subtotal </span>

          <strong class="order-meta-value">
            {{ formatCurrency(summary.subtotal) }}
          </strong>
        </div>
      </div>

      <div class="order-meta-item">
        <Tag size="18" class="order-meta-icon" />
        <div>
          <span class="order-meta-label"> Total Discount </span>

          <strong class="order-meta-value">
            {{ formatCurrency(summary.totalDiscount) }}
          </strong>
        </div>
      </div>
    </div>

    <div class="order-grand-total">
      <span class="order-meta-label">Grand Total</span>

      <strong class="order-meta-value">
        {{ formatCurrency(summary.grandTotal) }}
      </strong>
    </div>
  </div>
</template>

<style scoped>
.order-card {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.order-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid var(--border-colour);
}

.order-card-eyebrow {
  margin: 0 0 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-colour-secondary);
}

.order-card-header .card-title {
  margin: 0;
}

.order-meta-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  flex: 1;
}

.order-meta-icon {
  flex-shrink: 0;
  color: var(--text-colour-secondary);
}

.order-meta-item > div {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.order-meta-label,
.order-summary-stat span {
  font-size: 0.8125rem;
  color: var(--text-colour-secondary);
}

.order-meta-value {
  font-size: 0.9375rem;
  color: var(--text-colour-primary);
}

.order-meta-divider {
  width: 1px;
  background: var(--border-colour);
}

.order-summary-grid {
  display: flex;
  align-items: stretch;
  gap: 1.25rem;
}

.order-summary-stat + .order-summary-stat {
  border-left: 1px solid var(--border-colour);
}

.order-summary-stat strong {
  font-size: 1rem;
}

.order-grand-total {
  background-color: var(--bg-info-muted);
  border: 1px solid var(--border-info);
  border-radius: 4px;
  color: var(--text-colour-info);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
}

.order-grand-total span {
  font-size: 0.875rem;
  font-weight: 600;
}

.order-grand-total strong {
  font-size: 1.5rem;
  color: var(--text-colour-primary);
}

@media (max-width: 640px) {
  .order-card-meta {
    flex-direction: column;
  }

  .order-meta-divider {
    width: 100%;
    height: 1px;
  }

  .order-summary-grid {
    grid-template-columns: 1fr;
  }

  .order-summary-stat + .order-summary-stat {
    border-top: 1px solid var(--border-colour);
    border-left: none;
  }
}
</style>
