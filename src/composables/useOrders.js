import { ref, watch, onMounted, toRef, computed } from 'vue'
import { getOrders } from '../services/orderService'
import { useDebounce } from './useDebounce'

export function useOrders(filters) {
  const orders = ref([])
  const loading = ref(false)
  const error = ref(null)
  const abortController = ref(null)

  const debouncedSearchTerm = useDebounce(
    toRef(filters, 'query')
  )

  const orderQueryOptions = computed(() => ({
    query: debouncedSearchTerm.value,
    status: filters.status,
    sortField: filters.sort.field,
    sortDirection: filters.sort.direction,
    page: filters.pagination.currentPage,
    pageSize: filters.pagination.pageSize,
  }))

  async function fetchOrders() {

    if (abortController.value) {
      abortController.value.abort()
    }

    const controller = new AbortController()
    abortController.value = controller

    loading.value = true
    error.value = null

    try {

      const { data, total: totalItems } = await getOrders({
        query: debouncedSearchTerm.value,
        status: filters.status,
        sort: filters.sort,
        page: filters.pagination.currentPage,
        pageSize: filters.pagination.pageSize,
        signal: controller.signal
      })

      orders.value = data
      filters.pagination.totalItems = totalItems

    } catch (err) {
      if (err.name !== 'AbortError') {
        error.value = err.message || 'An error occurred while fetching orders.'
      }
    } finally {

      if (abortController.value === controller) {
        loading.value = false
      }

    }   
  }
  
    watch(
        orderQueryOptions, 
        fetchOrders,
        { 
            immediate: true 
        }
    )

  return {
    orders,
    loading,
    error,
    refresh: fetchOrders,
  }
}