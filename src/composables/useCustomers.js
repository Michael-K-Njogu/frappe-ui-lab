import { ref, watch, onMounted, toRef, computed } from 'vue'
import { getCustomers } from '../services/customerService'
import { useDebounce } from './useDebounce'

export function useCustomers(filters) {
  const customers = ref([])
  const loading = ref(false)
  const error = ref(null)

  const debouncedSearchTerm = useDebounce(
    toRef(filters, 'query')
  )

  const customerQueryOptions = computed(() => ({
    query: debouncedSearchTerm.value,
    customerType: filters.customerType,
    sortField: filters.sort.field,
    sortDirection: filters.sort.direction,
    page: filters.pagination.currentPage,
    pageSize: filters.pagination.pageSize,
  }))

  async function fetchCustomers() {
    loading.value = true
    error.value = null

    try {

    const { data, total: totalItems } = await getCustomers({
      query: debouncedSearchTerm.value,
      customerType: filters.customerType,
      sort: filters.sort,
      page: filters.pagination.currentPage,
      pageSize: filters.pagination.pageSize,
    })

    customers.value = data
    filters.pagination.totalItems = totalItems

    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }   
  }

  function refresh() {
    fetchCustomers()
  }

  onMounted(fetchCustomers)

  function watchFilters() {

    watch(
      customerQueryOptions,
      fetchCustomers
    )
  }

  watchFilters()

  return {
    customers,
    loading,
    error,
    refresh,
    filters
  }
}