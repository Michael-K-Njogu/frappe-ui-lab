<script setup>
import { reactive, watch, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCustomers } from '../composables/useCustomers'
import PageTitle from '../components/PageTitle.vue'
import BaseSearchInput from '../components/BaseSearchInput.vue'
import BaseSelect from '../components/BaseSelect.vue'
import BasePagination from '../components/base/BasePagination.vue'
import { Plus, RefreshCw, ArrowDownWideNarrow, ArrowUpNarrowWide } from '@lucide/vue'
import { getCustomerTypeLabel, customerTypes } from '../config/customerTypes'
import { formatCurrency, formatDate } from '../utils/formatters'
import { useSorting } from '../composables/useSorting'
import { useCustomerFilters } from '../composables/useCustomerFilters'

const { filters } = useCustomerFilters() // Use the composable to manage filters

const {
    customers,
    loading,
    error,
    refresh
} = useCustomers(filters)

const refreshing = ref(false)

async function handleRefresh() {
  refreshing.value = true

  try {
    await refresh()
  } finally {
    refreshing.value = false
  }
}

function viewCustomer(id) {
    router.push({ name: 'customer-details', params: { id } })
}

const { 
  sortBy, 
  isSorted, 
  sortIcon 
} = useSorting(filters.sort)

function handlePageChange(page) {
  filters.pagination.currentPage = page
}

function handlePageSizeChange(size) {
  filters.pagination.pageSize = size
}

</script>

<template>
  <PageTitle title="Customers">
    <template #actions>
      <button
        class="btn btn-secondary"
        :disabled="refreshing"
        @click="handleRefresh"
      >
        <RefreshCw 
          :size="16" 
          :class="{ 'is-loading': refreshing }"
        />
        {{ refreshing ? 'Refreshing' : 'Refresh' }}
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

  <div class="toolbar">
    <BaseSearchInput
      v-model="filters.query"
      placeholder="Search customers..."
    />

    <BaseSelect
      v-model="filters.customerType"
      :options="customerTypes"
    />
  </div>

  <p v-if="loading">Loading customers...</p>

  <p v-else-if="error">
    {{ error }}
  </p>

  <div class="table-container" v-if="!loading && !error">
    <p v-if="customers.length === 0">No customers found.</p>
    <table v-else class="data-table">
    <thead>
      <tr>
        <th>
          <button
            class="sort-button"
            @click="sortBy('name')"
          >
            Name
              <component
                v-if="isSorted('name')"
                :is="sortIcon('name')"
                size="14"
              />
          </button>
        </th>
        <th>
          <button
            class="sort-button"
            @click="sortBy('email')"
          >
            Email
              <component
                v-if="isSorted('email')"
                :is="sortIcon('email')"
                size="14"
              />
          </button>
        </th>
        <th>
          <button
            class="sort-button"
            @click="sortBy('creditLimit')"
          >
            Credit Limit
              <component
                v-if="isSorted('creditLimit')"
                :is="sortIcon('creditLimit')"
                size="14"
              />
          </button>
        </th>
        <th>
          <button
            class="sort-button"
            @click="sortBy('customerType')"
          >
            Customer Type
              <component
                v-if="isSorted('customerType')"
                :is="sortIcon('customerType')"
                size="14"
              />
          </button>
        </th>
        <th>
          <button
            class="sort-button"
            @click="sortBy('createdAt')"
          >
            Created At
              <component
                v-if="isSorted('createdAt')"
                :is="sortIcon('createdAt')"
                size="14"
              />
          </button>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="customer in customers"
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

  <BasePagination
    :current-page="filters.pagination.currentPage"
    :page-size="filters.pagination.pageSize"
    :total-items="filters.pagination.totalItems"
    @update:currentPage="handlePageChange"
    @update:pageSize="handlePageSizeChange"
  /> 

  </div>

</template>