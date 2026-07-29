<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCustomers } from '../composables/useCustomers'
import PageTitle from '../components/PageTitle.vue'
import BaseSearchInput from '../components/BaseSearchInput.vue'
import { Plus, RefreshCw } from '@lucide/vue'
import { getCustomerTypeLabel } from '../config/customerTypes'
import { formatCurrency, formatDate } from '../utils/formatters'
import { useDebounce } from '../composables/useDebounce'

const searchTerm = ref('')
const debouncedSearchTerm = useDebounce(searchTerm)

const filteredCustomers = computed(() => {
  const query = debouncedSearchTerm.value.trim().toLowerCase()

  if (!query) {
    return customers.value
  }

  return customers.value.filter((customer) => {
    return [
      customer.name,
      customer.email,
    ]
      .filter(Boolean)
      .some((value) =>
        value.toLowerCase().includes(query)
      )
  })
})

const router = useRouter()

const {
    customers,
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
      <button
        v-if="!loading && !error"
        class="btn btn-secondary"
        :disabled="loading"
        @click="loadCustomers"
      >
        <RefreshCw size="16" />
        {{ loading ? 'Loading...' : 'Refresh' }}
      </button>
      <RouterLink
        :to="{ name: 'customer-new' }"
        class="btn btn-primary"
      >
        <Plus size="16" />
        Add Customer
      </RouterLink>
    </template>
  </PageTitle>

  <BaseSearchInput
    v-model="searchTerm"
    placeholder="Search customers..."
  />

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
    <tbody>
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