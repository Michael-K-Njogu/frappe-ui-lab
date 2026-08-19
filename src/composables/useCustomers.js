import { ref, watch, onMounted, toRef, computed } from 'vue'
import { getCustomers } from '../services/customerService'
import { useDebounce } from './useDebounce'

export function useCustomers(filters) {
  const customers = ref([])
  const loading = ref(false)
  const error = ref(null)
  const abortController = ref(null)

  const debouncedSearchTerm = useDebounce(toRef(filters, 'query'))

  const customerQueryOptions = computed(() => ({
    query: debouncedSearchTerm.value,
    customerType: filters.customerType,
    sortField: filters.sort.field,
    sortDirection: filters.sort.direction,
    page: filters.pagination.currentPage,
    pageSize: filters.pagination.pageSize,
  }))

  async function fetchCustomers() {
    if (abortController.value) {
      abortController.value.abort()
    }

    const controller = new AbortController()
    abortController.value = controller

    loading.value = true
    error.value = null

    try {
      const { data, total: totalItems } = await getCustomers({
        query: debouncedSearchTerm.value,
        customerType: filters.customerType,
        sort: filters.sort,
        page: filters.pagination.currentPage,
        pageSize: filters.pagination.pageSize,
        signal: controller.signal,
      })

      customers.value = data
      filters.pagination.totalItems = totalItems
    } catch (err) {
      if (err.name !== 'AbortError') {
        error.value = err.message || 'An error occurred while fetching customers.'
      }
    } finally {
      if (abortController.value === controller) {
        loading.value = false
      }
    }
  }

  watch(customerQueryOptions, fetchCustomers, {
    immediate: true,
  })

  return {
    customers,
    loading,
    error,
    refresh: fetchCustomers,
  }
}
