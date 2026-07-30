import { ref, watch, onMounted, toRef } from 'vue'
import { getCustomers } from '../services/customerService'
import { useDebounce } from './useDebounce'

export function useCustomers(filters) {
  const customers = ref([])
  const loading = ref(false)
  const error = ref(null)

  const debouncedSearchTerm = useDebounce(
    toRef(filters, 'query')
  )

  async function fetchCustomers() {
    loading.value = true
    error.value = null 

    try {
      customers.value = await getCustomers({
        query: debouncedSearchTerm.value,
        customerType: filters.customerType,
        sort: filters.sort,
        page: filters.page,
        limit: filters.limit,
      })
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
    watch(debouncedSearchTerm, fetchCustomers)

    watch(
      () => [
        filters.customerType,
        filters.sort.field,
        filters.sort.direction,
        filters.page,
        filters.limit,
      ],
      fetchCustomers
    )
  }

  watchFilters()

  return {
    customers,
    loading,
    error,
    refresh,
  }
}