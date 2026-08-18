<script setup>
import { computed } from 'vue'

import { formatCurrency } from '../../utils/formatters.js'
import { calculateGrandTotal } from '../../business/orderCalculations.js'

import BaseEmptyState from '../base/BaseEmptyState.vue'
import { SquarePen, Trash2, Package } from '@lucide/vue'

const grandTotal = computed(() =>
    calculateGrandTotal(props.items)
)

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },

  loading: {
    type: Boolean,
    default: false,
  },    

  editable: {
    type: Boolean,
    default: false,
  }
  
})

const emit = defineEmits([
    'edit', 
    'delete'
])
</script>

<template>

    <BaseEmptyState
        v-if="!loading && !items.length"
        title="No products added"
        description="You can save this order as a draft, but you'll need to add at least one product before the order can be processed."
    >
        <template #icon>
            <Package :size="48" />
        </template>

        <template #actions>

            <slot name="actions" />

        </template>

    </BaseEmptyState>

<table v-else class="data-table">
    <thead>
        <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>Discount</th>
            <th>Line Total</th>
            <th v-if="editable"></th>
        </tr>
    </thead>

    <tbody>
        <tr
            v-for="item in items"
            :key="item.id"
        >
            <td>
                <div class="product-name">
                    {{ item.productName }}
                </div>

                <div class="product-sku">
                    {{ item.sku }}
                </div>
            </td>

            <td>
                {{ item.quantity }} {{ item.unit }}
            </td>

            <td>
                {{ formatCurrency(item.unitPrice) }}
            </td>

            <td>
                {{ formatCurrency(item.discount) }}
            </td>

            <td>
                {{ formatCurrency(item.lineTotal) }}
            </td>

            <td v-if="editable">
                <div class="row-actions">
                    <button 
                        @click="$emit('edit', item)"
                        class="btn btn-sm btn-secondary btn-icon"
                    >
                        <SquarePen :size="16" />
                    </button>

                    <button 
                        @click="$emit('delete', item)"
                        class="btn btn-sm btn-danger btn-icon"
                    >
                        <Trash2 :size="16" />
                    </button>
                </div>
            </td>
        </tr>
    </tbody>
    <tfoot v-if="items.length">
        <tr class="order-total-row">
            <td :colspan="editable ? 5 : 4">
                Grand Total
            </td>

            <td>
                {{ formatCurrency(grandTotal) }}
            </td>
        </tr>
    </tfoot>    
</table>
</template>

<style scoped>
.order-total-row {
    border-top: 2px solid var(--border-color);
}

.order-total-row td {
    padding: 1rem;
    font-weight: 600;
}

.order-total-row td:first-child {
    text-align: right;
    color: var(--text-secondary);
}

.order-total-row td:last-child {
    font-size: 1.05rem;
    font-weight: 700;
    white-space: nowrap;
}
</style>