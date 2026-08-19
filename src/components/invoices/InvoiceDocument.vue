<script setup>
import { computed } from 'vue'

import { formatCurrency } from '../../utils/formatters.js'
import { calculateGrandTotal } from '../../business/orderCalculations.js'

const props = defineProps({
    order: {
        type: Object,
        required: true,
    },

    items: {
        type: Array,
        default: () => [],
    },

    customer: {
        type: Object,
        default: null,
    },
})
    
const grandTotal = computed(() =>
    calculateGrandTotal(props.items)
)

const invoiceDate = computed(() => {
    const date =
        props.order.completedAt ||
        props.order.createdAt

    return date
        ? new Date(date).toLocaleDateString()
        : ''
})
</script>

<template>
    <article class="invoice-document">

        <!-- Header -->
        <header class="invoice-header">

            <div class="company-details">
                <h1>Your Company Name</h1>

                <p>
                    Company address<br>
                    Nairobi, Kenya
                </p>

                <p>
                    Email: info@example.com<br>
                    Phone: +254 XXX XXX XXX
                </p>
            </div>

            <div class="invoice-meta">

                <span class="invoice-label">
                    INVOICE
                </span>

                <dl>
                    <div>
                        <dt>Invoice No.</dt>
                        <dd>
                            {{ order.orderNumber }}
                        </dd>
                    </div>

                    <div>
                        <dt>Date</dt>
                        <dd>
                            {{ invoiceDate }}
                        </dd>
                    </div>
                </dl>

            </div>

        </header>

        <!-- Customer -->
        <section class="invoice-section customer-section">

            <div>
                <span class="section-label">
                    Bill To
                </span>

                <h2>
                    {{ customer?.name || order.customerName }}
                </h2>

                <p v-if="customer?.contactPerson">
                    {{ customer.contactPerson }}
                </p>

                <p v-if="customer?.deliveryAddress">
                    {{ customer.deliveryAddress }}
                </p>

                <p v-if="customer?.city">
                    {{ customer.city }},
                    {{ customer.region }}
                </p>

                <p v-if="customer?.email">
                    {{ customer.email }}
                </p>

                <p v-if="customer?.phonePrimary">
                    {{ customer.phonePrimary }}
                </p>

                <p v-if="customer?.vatNumber">
                    VAT No: {{ customer.vatNumber }}
                </p>
            </div>

        </section>

        <!-- Items -->
        <section class="invoice-section">

            <table class="invoice-items">

                <thead>
                    <tr>
                        <th>Product</th>
                        <th>SKU</th>
                        <th class="numeric">Qty</th>
                        <th class="numeric">Unit Price</th>
                        <th class="numeric">Discount</th>
                        <th class="numeric">Total</th>
                    </tr>
                </thead>

                <tbody>
                    <tr
                        v-for="item in items"
                        :key="item.id"
                    >
                        <td>
                            {{ item.productName }}
                        </td>

                        <td>
                            {{ item.sku }}
                        </td>

                        <td class="numeric">
                            {{ item.quantity }}
                        </td>

                        <td class="numeric">
                            {{ formatCurrency(item.unitPrice) }}
                        </td>

                        <td class="numeric">
                            {{ formatCurrency(item.discount) }}
                        </td>

                        <td class="numeric">
                            {{ formatCurrency(item.lineTotal) }}
                        </td>
                    </tr>
                </tbody>

            </table>

        </section>

        <!-- Totals -->
        <section class="invoice-totals">

            <div class="total-row grand-total">
                <span>Grand Total</span>

                <strong>
                    {{ formatCurrency(grandTotal) }}
                </strong>
            </div>

        </section>

        <!-- Footer -->
        <footer class="invoice-footer">

            <p>
                Thank you for your business.
            </p>

            <p v-if="order.notes">
                <strong>Notes:</strong>
                {{ order.notes }}
            </p>

        </footer>

    </article>
</template>