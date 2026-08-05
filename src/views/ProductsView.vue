<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

// Components
import PageTitle from '../components/PageTitle.vue'
import BaseButton from '../components/base/BaseButton.vue'
import BaseSearchInput from '../components/base/BaseSearchInput.vue'
import BaseSelect from '../components/BaseSelect.vue'
import ProductTable from '../components/products/ProductTable.vue'
import { Plus, RefreshCw } from '@lucide/vue'

// Services & Utilities
import { useProducts } from '../composables/useProducts'
import { useSorting } from '../composables/useSorting'
import { PRODUCT_STATUS_OPTIONS } from '../constants/productStatuses.js'
import { PRODUCT_CATEGORIES, PRODUCT_CATEGORY_OPTIONS } from '../constants/productCategories'

const router = useRouter()
const filters = reactive({
  query: '',
  category: '',
  status: '',

  sort: {
    field: 'name',
    direction: 'asc',
  },

  pagination: {
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
  },
})

const {
  products,
  loading,
  error,
  refresh,
} = useProducts(filters)

function sort(field) {
  if (filters.sort.field === field) {
    filters.sort.direction =
      filters.sort.direction === 'asc'
        ? 'desc'
        : 'asc'
  } else {
    filters.sort.field = field
    filters.sort.direction = 'asc'
  }
}
</script>

<template>

    <PageTitle title="Products">

        <template #actions>

            <BaseButton
                label="Refresh"
                variant="secondary"
                @click="router.go(0)"
            >
                <template #icon>
                    <RefreshCw size="16" />
                </template>
            </BaseButton>

            <BaseButton
                label="Add New Product"
                @click="router.push({ name: 'product-new' })"
            >
                <template #icon>
                    <Plus size="16" />
                </template>
            </BaseButton>
        </template>

    </PageTitle>

    <div class="toolbar">

      <BaseSearchInput
        v-model="filters.query"
        placeholder="Search by SKU or product name..."
        :disabled="loading"
      />

      <BaseSelect
        name="category"
        id="category"
        :show-label="false"
        v-model="filters.category"
        all-options-selected-text="All Categories"
        :options="PRODUCT_CATEGORY_OPTIONS"
        :disabled="loading"
      />      

      <BaseSelect
        name="status"
        id="status"
        :show-label="false"
        v-model="filters.status"
        all-options-selected-text="All Statuses"
        :options="PRODUCT_STATUS_OPTIONS"
        :disabled="loading"
      />      

    </div>    

    <div class="data-table-container">
        <ProductTable
            :products="products"
            :sort="filters.sort"
            @sort="sort"
        />
    </div>

</template>