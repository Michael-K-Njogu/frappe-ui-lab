<script setup>
import { getCustomerTypeLabel } from '../../constants/customerTypes.js'
import BaseBadge from '../base/BaseBadge.vue'
import { User, Mail, Phone, Ellipsis, Forward } from '@lucide/vue'

defineProps({
  customer: {
    type: Object,
    required: true,
  },
})

import { formatDate, formatCurrency } from '../../utils/formatters.js'

// Function to return the initials of the customer's name
function getInitials(name) {
  if (!name) return ''
  const names = name.split(' ')
  const initials = names.map((n) => n[0].toUpperCase())
  return initials.join('')
}
</script>

<template>
  <section class="customer-card">
    <div class="card customer-details">
      <div class="customer-details__left">
        <div class="avatar avatar--large">
          <img v-if="customer.image" :src="customer.image" :alt="customer.name" />
          <span v-else>{{ getInitials(customer.name) }}</span>
        </div>

        <h2>{{ customer.name }}</h2>

        <ul>
          <li>
            <a :href="`mailto:${customer.email}`" class="card-icon">
              <Mail size="16" />
            </a>
          </li>
          <li>
            <a :href="`tel:${customer.phonePrimary}`" class="card-icon">
              <Phone size="16" />
            </a>
          </li>
          <li>
            <RouterLink :to="`/customers/${customer.id}`" class="card-icon">
              <Forward size="16" />
            </RouterLink>
          </li>
        </ul>

        <BaseBadge v-if="customer" variant="info">
          {{ getCustomerTypeLabel(customer.customerType) }}
        </BaseBadge>

        <div></div>
      </div>

      <div class="customer-details__right"></div>
    </div>

    <div class="card customer-orders">
      <div class="card-header">
        <h3>Customer Details</h3>
      </div>

      <div class="info-group">
        <h4 class="info-label">Email:</h4>
        <p class="info-value">{{ customer.email }}</p>
      </div>

      <div class="info-group">
        <h4 class="info-label">Phone:</h4>
        <p class="info-value">{{ customer.phonePrimary }}</p>
      </div>

      <div class="info-group">
        <h4 class="info-label">Delivery Address:</h4>
        <p class="info-value">{{ customer.deliveryAddress }}</p>
      </div>

      <div class="info-group">
        <h4 class="info-label">City:</h4>
        <p class="info-value">{{ customer.city }}</p>
      </div>

      <div class="info-group">
        <h4 class="info-label">Date Created:</h4>
        <p class="info-value">{{ formatDate(customer.createdAt) }}</p>
      </div>

      <div class="info-group">
        <h4 class="info-label">Credit Limit:</h4>
        <p class="info-value">{{ formatCurrency(customer.creditLimit) }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
