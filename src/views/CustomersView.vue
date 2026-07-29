<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCustomers } from '../composables/useCustomers'
import PageTitle from '../components/PageTitle.vue'
import { Plus } from '@lucide/vue'
import { getCustomerTypeLabel } from '../config/customerTypes'

import { formatCurrency, formatDate } from '../utils/formatters'

const router = useRouter()

const {
    filteredCustomers,
    searchTerm,
    loading,
    error,
    loadCustomers
} = useCustomers()

onMounted(() => {
    loadCustomers()
})

function viewCustomer(id) {
    router.push({ name: 'customer-details', params: { id } })
}
</script>

<template>
  <PageTitle title="Customers">
    <template #actions>
      <RouterLink
        :to="{ name: 'customer-new' }"
        class="btn btn-primary"
      >
        <Plus size="16" />
        Add Customer
      </RouterLink>
    </template>
  </PageTitle>

    <div class="form-group">
      <input
      name="search"
      id="search"
      type="text"
      v-model="searchTerm"
      placeholder="Search customers..."
      />
    </div>

  <p v-if="loading">Loading customers...</p>

  <p v-else-if="error">
    {{ error }}
  </p>

  <div class="table-container" v-if="!loading && !error">
    <p v-if="filteredCustomers.length === 0">No customers found.</p>
    <table v-else class="data-table">
    <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Credit Limit</th>
        <th>Customer Type</th>
        <th>Created At</th>
      </tr>
    </thead>
    <tbody v-if="filteredCustomers.length">
      <tr
        v-for="customer in filteredCustomers"
        :key="customer.id"
        @click="viewCustomer(customer.id)"
      >
        <td>{{ customer.name }}</td>
        <td>{{ customer.email }}</td>
        <td>{{ formatCurrency(customer.creditLimit) }}</td>
        <td>{{ getCustomerTypeLabel(customer.customerType) }}</td>
        <td>{{ formatDate(customer.createdAt) }}</td>
      </tr>
    </tbody>
  </table>
  </div>

</template>