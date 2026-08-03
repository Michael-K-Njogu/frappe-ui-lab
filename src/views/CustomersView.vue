<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCustomers } from '../composables/useCustomers'
import PageTitle from '../components/PageTitle.vue'
import BaseSearchInput from '../components/BaseSearchInput.vue'
import BaseSelect from '../components/BaseSelect.vue'
import BasePagination from '../components/base/BasePagination.vue'
import { Plus, RefreshCw } from '@lucide/vue'
import { getCustomerTypeLabel, customerTypes } from '../constants/customerTypes.js'
import { formatCurrency, formatDate } from '../utils/formatters'
import { useSorting } from '../composables/useSorting'
import { useCustomerFilters } from '../composables/useCustomerFilters'
import CustomerTableSkeleton from '../components/customers/CustomerTableSkeleton.vue'
import BaseEmptyState from '../components/base/BaseEmptyState.vue'
import { UsersRound, SearchX } from '@lucide/vue'

const router = useRouter()

const {
  filters,
  hasActiveFilters,
  clearFilters
} = useCustomerFilters()

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

const emptyState = computed(() => {
  if (hasActiveFilters.value) {
    return {
      title: 'No matching customers found',
      description: 'No customers match your search criteria. Please adjust your filters and try again.',
      type: 'filter'
    }
  } else {
    return {
      title: 'No customers available',
      description: 'Looks like you haven\'t added any customers yet. Create your first customer to get started.',
      type: 'initial'
    }
  }
})

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
      all-options-selected-text="All Customer Types"
    />
  </div>

  <CustomerTableSkeleton v-if="loading" :rows="5" />

  <p v-else-if="error">
    {{ error }}
  </p>

  <div class="data-table-container" v-else-if="!loading && !error && customers.length > 0">
    <table class="data-table">
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
        class="clickable-row"
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

  <BaseEmptyState
    v-else
    :title="emptyState.title"
    :description="emptyState.description"
  >

    <template #icon>

      <UsersRound 
        v-if="emptyState.type === 'initial'"
        size="48" 
      />

      <SearchX 
        v-else-if="emptyState.type === 'filter'"
        size="48"
      />

    </template>

    <template #actions>
      <RouterLink
        v-if="emptyState.type === 'initial'"
        :to="{ name: 'customer-new' }"
        class="btn btn-primary"
      >
        <Plus size="16" />
        Add Customer
      </RouterLink>

      <button
        v-else-if="emptyState.type === 'filter'"
        class="btn btn-secondary"
        @click="clearFilters"
      >
        Clear Filters
      </button>
    </template>

  </BaseEmptyState>  

</template>