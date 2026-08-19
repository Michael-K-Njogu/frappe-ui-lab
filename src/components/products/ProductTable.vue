<script setup>
// Utilities
import { formatCurrency } from '../../utils/formatters'
import { PRODUCT_STATUS } from '../../constants/productStatuses.js'

import BaseBadge from '../base/BaseBadge.vue'
import { Eye, SquarePen, Trash2, ArrowUpDown, ArrowUp, ArrowDown } from '@lucide/vue'

defineProps({
  products: {
    type: Array,
    required: true,
  },

  sort: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['sort', 'view', 'edit', 'delete'])

function getProductStatusVariant(status) {
  switch (status) {
    case PRODUCT_STATUS.ACTIVE:
      return 'success'

    case PRODUCT_STATUS.INACTIVE:
      return 'danger'

    default:
      return 'default'
  }
}

function showProductUnit(product) {
  if (product.unit) {
    return `${product.stockQuantity} ${product.unit}${product.stockQuantity !== 1 ? 's' : ''}`
  } else {
    return product.stockQuantity
  }
}
</script>

<template>
  <table class="data-table">
    <thead>
      <tr>
        <th class="sortable" @click="$emit('sort', 'sku')">
          <span>
            SKU
            <component
              v-if="sort.field === 'sku'"
              :is="sort.direction === 'asc' ? ArrowUp : ArrowDown"
              :size="14"
            />
          </span>
        </th>
        <th class="sortable" @click="$emit('sort', 'name')">
          <span>
            Product
            <component
              v-if="sort.field === 'name'"
              :is="sort.direction === 'asc' ? ArrowUp : ArrowDown"
              :size="14"
            />
          </span>
        </th>
        <th class="sortable" @click="$emit('sort', 'category')">
          <span>
            Category
            <component
              v-if="sort.field === 'category'"
              :is="sort.direction === 'asc' ? ArrowUp : ArrowDown"
              :size="14"
            />
          </span>
        </th>
        <th class="sortable" @click="$emit('sort', 'sellingPrice')">
          <span>
            Selling Price
            <component
              v-if="sort.field === 'sellingPrice'"
              :is="sort.direction === 'asc' ? ArrowUp : ArrowDown"
              :size="14"
            />
          </span>
        </th>
        <th class="sortable" @click="$emit('sort', 'stockQuantity')">
          <span>
            Stock Quantity
            <component
              v-if="sort.field === 'stockQuantity'"
              :is="sort.direction === 'asc' ? ArrowUp : ArrowDown"
              :size="14"
            />
          </span>
        </th>
        <th class="sortable" @click="$emit('sort', 'status')">
          <span>
            Status
            <component
              v-if="sort.field === 'status'"
              :is="sort.direction === 'asc' ? ArrowUp : ArrowDown"
              :size="14"
            />
          </span>
        </th>
        <th>Actions</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="product in products" :key="product.id">
        <td>{{ product.sku }}</td>
        <td>{{ product.name }}</td>
        <td>{{ product.category }}</td>
        <td>{{ formatCurrency(product.sellingPrice) }}</td>
        <td>{{ showProductUnit(product) }}</td>
        <td>
          <BaseBadge :variant="getProductStatusVariant(product.status)">
            {{ product.status }}
          </BaseBadge>
        </td>
        <td class="row-actions">
          <button
            class="btn btn-sm btn-secondary btn-icon"
            @click="$emit('view', product.id)"
            title="View Product"
          >
            <Eye size="16" />
          </button>

          <button
            class="btn btn-sm btn-secondary btn-icon"
            @click="$emit('edit', product.id)"
            title="Edit Product"
          >
            <SquarePen size="16" />
          </button>

          <button
            class="btn btn-sm btn-danger btn-icon"
            @click="$emit('delete', product)"
            title="Delete Product"
          >
            <Trash2 size="16" />
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>
