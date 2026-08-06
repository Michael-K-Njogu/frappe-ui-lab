<script setup>
import { getCustomerTypeLabel } from '../../constants/customerTypes.js'
import BaseBadge from '../base/BaseBadge.vue';
import { User, Mail, Phone, Ellipsis, Forward } from '@lucide/vue';

defineProps({
    customer: {
        type: Object,
        required: true,
    },
})

import {
    formatDate,
    formatCurrency,
} from '../../utils/formatters.js'

// Function to return the initials of the customer's name
function getInitials(name) {
    if (!name) return '';
    const names = name.split(' ');
    const initials = names.map(n => n[0].toUpperCase());
    return initials.join('');
}
</script>

<template>
  <section class="customer-card">

    <div class="card customer-details">

      <div class="customer-details__left">

        <div class="avatar avatar--large">
          <User size="48" />
        </div>

          <h2>{{ customer.name }}</h2>

          <ul>
            <li>
              <RouterLink :to="`mailto:${customer.email}`" class="card-icon">
                <Mail size="16" />
              </RouterLink>
            </li>
            <li>
              <RouterLink :to="`tel:${customer.phone}`" class="card-icon">
                <Phone size="16" />
              </RouterLink>
            </li>
            <li>
              <RouterLink :to="`/customers/${customer.id}`" class="card-icon">
                <Forward size="16" />
              </RouterLink>
            </li>
          </ul>

          <BaseBadge
            v-if="customer"
            variant="info"
          >
            {{ getCustomerTypeLabel(customer.customerType) }}
        </BaseBadge>
          
          <div>
            
        </div>
      </div>

      <div class="customer-details__right">
      </div>      

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
        <p class="info-value">+254 710 570 983</p>
      </div>

      <div class="info-group">
        <h4 class="info-label">Primary Address:</h4>
        <p class="info-value">123 Main St, Nairobi, Kenya</p> 
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

<style scoped>
.info-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 8px;
}

.info-label {
  margin-bottom: 0;
}

.info-value {
  margin: 0;
}

ul {
  list-style: none;
  padding: 0;
  display: flex;
  gap: 8px;
}

.card-icon {
  border: 1px solid var(--border-colour-default);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--bg-colour-default);
  color: var(--text-colour-secondary);
}

.customer-card {
    display: flex;
    align-items: flex-start;
    font-size: 14px;
    gap: 1rem;
}

.avatar {
    color: var(--text-colour-secondary);
    font-size: 2.5rem;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background-color: var(--bg-colour-default);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 12px;
}

.customer-orders {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.customer-details__left {
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-width: 240px;
    gap: 8px;
    text-align: center;
}
</style>