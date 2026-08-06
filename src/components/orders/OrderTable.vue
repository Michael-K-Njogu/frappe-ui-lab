<script setup>
import { formatCurrency, formatDate } from '../../utils/formatters'
import { ORDER_STATUS } from '../../constants/orderStatuses.js'
import { canEditOrder, canDeleteOrder, canPrintOrder, getEditRestrictionReason } from '../../business/orderPermissions.js'

import BaseBadge from '../base/BaseBadge.vue'
import { Eye, Pencil, Trash2, ArrowUp, ArrowDown, SquarePen, MessageSquareText, Printer } from '@lucide/vue'

defineProps({
    orders: {
        type: Array,
        required: true,
    },

    sort: {
        type: Object,
        required: true,
    },
})

const emit = defineEmits([
    'sort',
    'view',
    'edit',
    'delete',
    'print'
])

function getOrderStatusVariant(status) {
  switch (status) {
    case ORDER_STATUS.COMPLETED:
      return 'success'

    case ORDER_STATUS.PENDING:
      return 'warning'

    case ORDER_STATUS.CANCELED:
      return 'danger'

    case ORDER_STATUS.PROCESSING:
      return 'info' 

    case ORDER_STATUS.DRAFT:
      return 'draft'

    default:
      return 'default'
  }
}
</script>

<template>
        <table class="data-table">
            <thead>
                <tr>
                    <th>
                        <button
                            class="sort-button"
                            @click="$emit('sort', 'orderNumber')"
                        >
                            Order Number
                            <component
                                v-if="sort.field === 'orderNumber'"
                                :is="sort.direction === 'asc' ? ArrowUp : ArrowDown"
                                size="14"
                            />
                        </button>
                    </th>
                    <th>
                        <button
                            class="sort-button"
                            @click="$emit('sort', 'customerName')"
                        >
                            Customer
                            <component
                                v-if="sort.field === 'customerName'"
                                :is="sort.direction === 'asc' ? ArrowUp : ArrowDown"
                                size="14"
                            />
                        </button>
                    </th>
                    <th>
                        <button
                            class="sort-button"
                            @click="$emit('sort', 'createdAt')"
                        >
                            Date Created
                            <component
                                v-if="sort.field === 'createdAt'"
                                :is="sort.direction === 'asc' ? ArrowUp : ArrowDown"
                                size="14"
                            />
                        </button>
                    </th>
                    <th>
                        <button
                            class="sort-button"
                            @click="$emit('sort', 'totalAmount')"
                        >
                            Total
                            <component
                                v-if="sort.field === 'totalAmount'"
                                :is="sort.direction === 'asc' ? ArrowUp : ArrowDown"
                                size="14"
                            />
                        </button>
                    </th>
                    <th>
                        <button
                            class="sort-button"
                            @click="$emit('sort', 'status')"
                        >
                            Status
                            <component
                                v-if="sort.field === 'status'"
                                :is="sort.direction === 'asc' ? ArrowUp : ArrowDown"
                                size="14"
                            />
                        </button>
                    </th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="order in orders" :key="order.id"> 
                    <td>
                        {{ order.orderNumber }}
                        <span v-if="order.notes" class="notes-icon" :title="order.notes">
                            <MessageSquareText size="16" />
                        </span>
                    </td>
                    <td>{{ order.customerName }}</td>
                    <td>{{ formatDate(order.createdAt) }}</td>
                    <td>{{ formatCurrency(order.totalAmount) }}</td>
                    <td>
                        <BaseBadge :variant="getOrderStatusVariant(order.status)">
                            {{ order.status }}
                        </BaseBadge>
                    </td>
                    <td class="row-actions">
                        <button 
                            :aria-label="`View Order: ${order.orderNumber}`" 
                            :title="`View Order: ${order.orderNumber}`" 
                            @click="$emit('view', order.id)" 
                            class="btn btn-sm btn-secondary btn-icon"
                        >
                            <Eye size="16" />
                        </button>

                        <button 
                            v-if="canEditOrder(order)"
                            :disabled="!!getEditRestrictionReason(order)"
                            :title="getEditRestrictionReason(order) || `Edit Order: ${order.orderNumber}`"
                            :aria-label="`Edit Order: ${order.orderNumber}`" 
                            @click="$emit('edit', order.id)" 
                            class="btn btn-sm btn-secondary btn-icon"
                        >
                            <SquarePen size="16" />
                        </button>

                        <button
                            v-if="canPrintOrder(order)"
                            :aria-label="`Print Order: ${order.orderNumber}`" 
                            :title="`Print Order: ${order.orderNumber}`"
                            @click="$emit('print', order.id)" 
                            class="btn btn-sm btn-secondary btn-icon"
                        >
                            <Printer size="16" />
                        </button>

                        <button 
                            v-if="canDeleteOrder(order)"
                            :aria-label="`Delete Order: ${order.orderNumber}`" 
                            :title="`Delete Order: ${order.orderNumber}`" 
                            @click="$emit('delete', order)" 
                            class="btn btn-sm btn-icon btn-danger"
                        >
                            <Trash2 size="16" />
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
</template>