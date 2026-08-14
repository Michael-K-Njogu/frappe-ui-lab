<script setup>
import { formatCurrency } from '../../utils/formatters.js'
import { SquarePen, Trash2, Package } from '@lucide/vue'
import BaseEmptyState from '../base/BaseEmptyState.vue'

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
</table>
</template>