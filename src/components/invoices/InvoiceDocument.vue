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

    if (!date) return ''

    return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(new Date(date))
})
</script>

<template>
    <article class="invoice-document">

        <!-- Invoice Header -->
        <header class="invoice-header">

            <div class="company">

                <div class="company-logo">
                    DDS
                </div>

                <div class="company-info">
                    <h1>
                        Digital Distribution Solutions
                    </h1>

                    <p>
                        Nairobi, Kenya
                    </p>

                    <p>
                        info@example.com · +254 XXX XXX XXX
                    </p>
                </div>

            </div>

            <div class="invoice-heading">

                <span class="invoice-label">
                    INVOICE
                </span>

                <div class="invoice-number">
                    #{{ order.orderNumber }}
                </div>

            </div>

        </header>


        <!-- Invoice Meta -->
        <section class="invoice-meta">

            <div class="meta-block">
                <span class="meta-label">
                    Invoice Date
                </span>

                <strong>
                    {{ invoiceDate }}
                </strong>
            </div>

            <div class="meta-block">
                <span class="meta-label">
                    Order Number
                </span>

                <strong>
                    {{ order.orderNumber }}
                </strong>
            </div>

            <div class="meta-block">
                <span class="meta-label">
                    Status
                </span>

                <strong class="status">
                    {{ order.status }}
                </strong>
            </div>

        </section>


        <!-- Customer -->
        <section class="customer-section">

            <div class="section-heading">
                Bill To
            </div>

            <div class="customer-details">

                <h2>
                    {{ customer?.name || order.customerName }}
                </h2>

                <p v-if="customer?.contactPerson">
                    {{ customer.contactPerson }}
                </p>

                <p v-if="customer?.deliveryAddress">
                    {{ customer.deliveryAddress }}
                </p>

                <p v-if="customer?.city || customer?.region">
                    {{ customer?.city }}<span
                        v-if="customer?.city && customer?.region"
                    >, </span>{{ customer?.region }}
                </p>

                <p v-if="customer?.email">
                    {{ customer.email }}
                </p>

                <p v-if="customer?.phonePrimary">
                    {{ customer.phonePrimary }}
                </p>

                <p v-if="customer?.vatNumber">
                    VAT No. {{ customer.vatNumber }}
                </p>

            </div>

        </section>


        <!-- Items -->
        <section class="items-section">

            <div class="section-heading">
                Order Items
            </div>

            <table class="invoice-items">

                <thead>
                    <tr>
                        <th class="product-column">
                            Product
                        </th>

                        <th>
                            SKU
                        </th>

                        <th class="numeric">
                            Qty
                        </th>

                        <th class="numeric">
                            Unit Price
                        </th>

                        <th class="numeric">
                            Discount
                        </th>

                        <th class="numeric">
                            Amount
                        </th>
                    </tr>
                </thead>

                <tbody>

                    <tr
                        v-for="item in items"
                        :key="item.id"
                    >

                        <td class="product-column">
                            <strong>
                                {{ item.productName }}
                            </strong>

                            <span>
                                {{ item.unit }}
                            </span>
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

                        <td class="numeric amount">
                            {{ formatCurrency(item.lineTotal) }}
                        </td>

                    </tr>

                </tbody>

            </table>

        </section>


        <!-- Totals -->
        <section class="totals-section">

            <div class="totals">

                <div class="total-row">
                    <span>Subtotal</span>

                    <span>
                        {{
                            formatCurrency(
                                items.reduce(
                                    (total, item) =>
                                        total +
                                        Number(item.lineTotal || 0),
                                    0
                                )
                            )
                        }}
                    </span>
                </div>

                <div class="total-row grand-total">
                    <strong>
                        Grand Total
                    </strong>

                    <strong>
                        {{ formatCurrency(grandTotal) }}
                    </strong>
                </div>

            </div>

        </section>


        <!-- Notes -->
        <section
            v-if="order.notes"
            class="notes-section"
        >
            <div class="section-heading">
                Notes
            </div>

            <p>
                {{ order.notes }}
            </p>
        </section>


        <!-- Footer -->
        <footer class="invoice-footer">

            <strong>
                Thank you for your business.
            </strong>

            <p>
                This invoice was generated electronically.
            </p>

        </footer>

    </article>
</template>

<style scoped>
.invoice-document {
    box-shadow: 0 1px 3px rgb(0 0 0 / 0.08);
    width: 100%;
    max-width: 760px;
    margin: 0 auto;
    padding: 2.5rem;
    background: #fff;
    color: #1f2937;
    font-size: 0.875rem;
    line-height: 1.5;
}


/* --------------------------------
   Header
-------------------------------- */

.invoice-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 2rem;
    padding-bottom: 2rem;
    border-bottom: 2px solid #111827;
}

.company {
    display: flex;
    align-items: flex-start;
    gap: 0.875rem;
}

.company-logo {
    width: 42px;
    height: 42px;
    display: grid;
    place-items: center;
    flex-shrink: 0;

    background: #111827;
    color: #fff;

    border-radius: 0.375rem;

    font-size: 0.75rem;
    font-weight: 700;
}

.company-info h1 {
    margin: 0 0 0.375rem;

    font-size: 1rem;
    font-weight: 700;
    color: #111827;
}

.company-info p {
    margin: 0.125rem 0;

    color: #6b7280;
    font-size: 0.75rem;
}

.invoice-heading {
    text-align: right;
}

.invoice-label {
    display: block;

    font-size: 1.75rem;
    line-height: 1;
    font-weight: 800;
    letter-spacing: 0.04em;

    color: #111827;
}

.invoice-number {
    margin-top: 0.5rem;

    font-size: 0.75rem;
    color: #6b7280;
}


/* --------------------------------
   Invoice metadata
-------------------------------- */

.invoice-meta {
    display: grid;
    grid-template-columns: repeat(3, 1fr);

    margin: 1.5rem 0;

    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    overflow: hidden;
}

.meta-block {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    padding: 0.75rem 1rem;
}

.meta-block + .meta-block {
    border-left: 1px solid #e5e7eb;
}

.meta-label {
    font-size: 0.6875rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: #6b7280;
}

.meta-block strong {
    font-size: 0.8125rem;
    color: #111827;
}

.meta-block .status {
    text-transform: capitalize;
}


/* --------------------------------
   Sections
-------------------------------- */

.section-heading {
    margin-bottom: 0.75rem;

    font-size: 0.6875rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;

    color: #6b7280;
}


/* --------------------------------
   Customer
-------------------------------- */

.customer-section {
    margin-bottom: 2rem;
}

.customer-details {
    padding-left: 0.125rem;
}

.customer-details h2 {
    margin: 0 0 0.375rem;

    font-size: 1rem;
    font-weight: 700;
    color: #111827;
}

.customer-details p {
    margin: 0.125rem 0;

    font-size: 0.8125rem;
    color: #4b5563;
}


/* --------------------------------
   Items
-------------------------------- */

.items-section {
    margin-bottom: 1.5rem;
}

.invoice-items {
    width: 100%;
    border-collapse: collapse;

    font-size: 0.75rem;
}

.invoice-items thead {
    background: #f3f4f6;
}

.invoice-items th {
    padding: 0.625rem 0.5rem;

    border-top: 1px solid #d1d5db;
    border-bottom: 1px solid #d1d5db;

    font-size: 0.6875rem;
    font-weight: 700;
    text-align: left;
    color: #374151;

    white-space: nowrap;
}

.invoice-items td {
    padding: 0.75rem 0.5rem;

    border-bottom: 1px solid #e5e7eb;

    vertical-align: top;
}

.invoice-items .product-column {
    width: 32%;
}

.invoice-items td.product-column {
    display: table-cell;
}

.invoice-items td.product-column strong {
    display: block;

    font-size: 0.75rem;
    font-weight: 600;
    color: #111827;
}

.invoice-items td.product-column span {
    display: block;

    margin-top: 0.125rem;

    font-size: 0.6875rem;
    color: #6b7280;
}

.numeric {
    text-align: right !important;
    white-space: nowrap;
}

.amount {
    font-weight: 600;
    color: #111827;
}


/* --------------------------------
   Totals
-------------------------------- */

.totals-section {
    display: flex;
    justify-content: flex-end;

    margin-top: 1rem;
}

.totals {
    width: 280px;
}

.total-row {
    display: flex;
    justify-content: space-between;

    padding: 0.5rem 0;

    font-size: 0.8125rem;
}

.grand-total {
    margin-top: 0.25rem;
    padding: 0.875rem 0;

    border-top: 2px solid #111827;

    font-size: 1rem;
    color: #111827;
}


/* --------------------------------
   Notes
-------------------------------- */

.notes-section {
    margin-top: 2rem;
    padding-top: 1rem;

    border-top: 1px solid #e5e7eb;
}

.notes-section p {
    margin: 0;

    color: #4b5563;
    font-size: 0.75rem;
}


/* --------------------------------
   Footer
-------------------------------- */

.invoice-footer {
    margin-top: 3rem;
    padding-top: 1.25rem;

    border-top: 1px solid #e5e7eb;

    text-align: center;
}

.invoice-footer strong {
    display: block;

    font-size: 0.75rem;
    color: #374151;
}

.invoice-footer p {
    margin: 0.25rem 0 0;

    font-size: 0.6875rem;
    color: #9ca3af;
}


/* --------------------------------
   Responsive
-------------------------------- */

@media (max-width: 600px) {
    .invoice-document {
        padding: 1.5rem;
    }

    .invoice-header {
        flex-direction: column;
    }

    .invoice-heading {
        text-align: left;
    }

    .invoice-meta {
        grid-template-columns: 1fr;
    }

    .meta-block + .meta-block {
        border-left: none;
        border-top: 1px solid #e5e7eb;
    }

    .invoice-items {
        min-width: 620px;
    }
}
</style>