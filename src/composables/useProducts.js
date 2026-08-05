import { ref, watch, onMounted } from 'vue'
import { getProducts } from '../services/productService'

export function useProducts(filters) {
  const products = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function loadProducts() {
    loading.value = true
    error.value = null

    try {
      const result = await getProducts({
        query: filters.query,
        category: filters.category,
        status: filters.status,
        sort: filters.sort,
        page: filters.pagination.currentPage,
        pageSize: filters.pagination.pageSize,
      })

      products.value = result.data
      filters.pagination.totalItems = result.total

    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function refresh() {
    await loadProducts()
  }

  watch(
    filters,
    loadProducts,
    {
      deep: true,
    }
  )

  onMounted(loadProducts)

  return {
    products,
    loading,
    error,
    refresh,
  }
}