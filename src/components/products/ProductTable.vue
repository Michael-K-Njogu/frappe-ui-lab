<script setup>
// Utilities
import { formatCurrency } from '../../utils/formatters'

// Constants
import { PRODUCT_STATUS } from '../../constants/productStatuses.js'

// Components
import BaseBadge from '../base/BaseBadge.vue'

// Icons
import { Eye, SquarePen, Trash2, ArrowUpDown, ArrowUp, ArrowDown } from '@lucide/vue'

const props = defineProps({
  products: {
    type: Array,
    required: true,
  },

  sort: {
    type: Object,
    default: () => ({
      field: 'name',
      direction: 'asc',
    }),
  },
})

const emit = defineEmits([
    'sort',
    'view',
    'edit',
    'delete',
])

function isSorted(field) {
  return props.sort?.field === field
}

function sortIcon(field) {
  if (!isSorted(field)) {
    return ArrowUpDown
  }

  return props.sort.direction === 'asc'
    ? ArrowUp
    : ArrowDown
}

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

function sortBy(field) {
  emit('sort', field)
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
                <th 
                    :class="`sortable ${isSorted('sku') ? 'sorted' : ''}`"
                    @click="sortBy('sku')"
                >
                    <span>
                        SKU
                        <component
                            v-if="sortIcon('sku')"
                            :is="sortIcon('sku')"
                            :size="14"
                        />          
                    </span>
                </th>
                <th 
                    :class="`sortable ${isSorted('name') ? 'sorted' : ''}`"
                    @click="sortBy('name')"
                >
                    <span>
                        Product
                        <component
                            v-if="sortIcon('name')"
                            :is="sortIcon('name')"
                            :size="14"
                        />          
                    </span>              
                </th>
                <th 
                    :class="`sortable ${isSorted('category') ? 'sorted' : ''}`"
                    @click="sortBy('category')"
                >
                    <span>
                        Category
                        <component
                            v-if="sortIcon('category')"
                            :is="sortIcon('category')"
                            :size="14"
                            />          
                    </span>
                </th>
                <th 
                    :class="{
                        sortable: true,
                        sorted: isSorted('sellingPrice'),
                    }"
                    @click="sortBy('sellingPrice')"
                >
                    <span>
                        Selling Price
                        <component
                            v-if="sortIcon('sellingPrice')"
                            :is="sortIcon('sellingPrice')"
                            :size="14"
                        />          
                    </span>
                </th>      
                <th 
                    :class="{
                        sortable: true,
                        sorted: isSorted('stockQuantity'),
                    }"
                    @click="sortBy('stockQuantity')"
                >
                    <span>
                        Stock Quantity
                        <component
                            v-if="sortIcon('stockQuantity')"
                            :is="sortIcon('stockQuantity')"
                            :size="14"
                        />          
                    </span>
                </th>                           
                <th 
                    :class="{
                        sortable: true,
                        sorted: isSorted('status'),
                    }"
                    @click="sortBy('status')"
                >
                    <span>
                        Status
                        <component
                            v-if="sortIcon('status')"
                            :is="sortIcon('status')"
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
                    <BaseBadge :variant="statusVariant(product.status)">
                        {{ product.status }}
                    </BaseBadge>
                </td>
                <td class="row-actions">
                    <button
                        class="btn btn-sm btn-secondary btn-icon"
                        @click="emit('view', product.id)"
                        title="View Product"
                    >
                        <Eye size="16" />
                    </button>

                    <button
                        class="btn btn-sm btn-secondary btn-icon"
                        @click="emit('edit', product)"
                        title="Edit Product"
                    >
                        <SquarePen size="16" />
                    </button>

                    <button
                        class="btn btn-sm btn-danger btn-icon"
                        @click="emit('delete', product)"
                        title="Delete Product"
                    >
                        <Trash2 size="16" />
                    </button>
                </td>
            </tr>

        </tbody>

    </table>

</template>