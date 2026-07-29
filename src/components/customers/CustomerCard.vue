<script setup>
defineProps({
    customer: {
        type: Object,
        required: true,
    },
})

import {
    formatDate,
    formatCurrency,
} from '../../utils/formatters'        
</script>

<template>
  <section class="card">
    <div class="card-header">
      <h2>{{ customer.name }}</h2>
      <span class="badge">
        {{ customer.customerType }}
      </span>
    </div>

    <div class="card-body">
      <dl>
        <dt>Email</dt>
        <dd>{{ customer.email }}</dd>

        <dt>Credit Limit</dt>
        <dd>{{ formatCurrency(customer.creditLimit) }}</dd>

        <dt>Created</dt>
        <dd>{{ formatDate(customer.createdAt) }}</dd>
      </dl>
    </div>
  </section>
</template>