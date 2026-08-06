<script setup>
import { ORDER_STATUS, ORDER_STATUS_OPTIONS } from '../../constants/orderStatuses.js'
import { formatCurrency, formatDate } from '../../utils/formatters.js'
import BaseBadge from '../base/BaseBadge.vue'

defineProps({
    order: {
        type: Object,
        required: true,
    },
})
</script>

<template>

    <section class="card">
        <h2 class="text-2xl font-bold mb-4">Order #{{ order.orderNumber }}</h2>
        <div class="mb-4">
            <BaseBadge :label="ORDER_STATUS_OPTIONS[order.status]" :variant="order.status" />
        </div>
        <div class="mb-2">
            <strong>Total Amount:</strong> {{ formatCurrency(order.totalAmount) }}
        </div>
        <div class="mb-2">
            <strong>Order Date:</strong> {{ formatDate(order.createdAt) }}
        </div>
        <div class="mb-2">
            <strong>Last Updated:</strong> {{ formatDate(order.updatedAt) }}
        </div>
    </section>

</template>