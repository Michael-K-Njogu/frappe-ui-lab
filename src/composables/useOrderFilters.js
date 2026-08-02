import { reactive, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export function useOrderFilters() {
  const route = useRoute()
  const router = useRouter()

  const filters = reactive({
    query: '',
    status: '',
    sort: {
      field: 'createdAt',
      direction: 'desc'
    },
    pagination: {
      currentPage: 1,
      pageSize: 10,
      totalItems: 0
    }
  })

  function parseFiltersFromUrl() {
    return {
        query: route.query.q ?? '',

        status: route.query.status ?? '',

        sortField:
        route.query.sort ?? 'createdAt',

        sortDirection:
        route.query.direction ?? 'desc',

        currentPage:
        Number(route.query.page) || 1,

        pageSize:
        Number(route.query.pageSize) || 10,
    }
}

function initializeFiltersFromUrl() {
  const parsed = parseFiltersFromUrl()

  filters.query = parsed.query
  filters.status = parsed.status
  filters.sort.field = parsed.sortField
  filters.sort.direction = parsed.sortDirection
  filters.pagination.currentPage = parsed.currentPage
  filters.pagination.pageSize = parsed.pageSize

}

function serializeFilters() {
  return {
    q: filters.query || undefined,
    status: filters.status || undefined,
    sort: filters.sort.field === 'createdAt' ? undefined : filters.sort.field,
    direction: filters.sort.direction === 'desc' ? undefined : filters.sort.direction,
    page: filters.pagination.currentPage !== 1 ? filters.pagination.currentPage : undefined,
    pageSize: filters.pagination.pageSize !== 10 ? filters.pagination.pageSize : undefined,
  }
}

function syncFiltersToUrl() {
  watch(
    () => ({
      query: filters.query,
      status: filters.status,

      sortField: filters.sort.field,
      sortDirection: filters.sort.direction,

      currentPage:
        filters.pagination.currentPage,

      pageSize:
        filters.pagination.pageSize,
    }),

    () => {
      router.replace({
        query: serializeFilters(),
      })
    },
    {
      deep: true,
      immediate: true
    }
  )
}

  function resetPageWhenDatasetChanges() {
    watch(
      () => ({
        query: filters.query,

        status:
          filters.status,

        pageSize:
          filters.pagination.pageSize,
      }),
      () => {
        filters.pagination.currentPage = 1
      }
    )
  }

  const hasActiveFilters = computed(() => {
    return Boolean(
      filters.query ||
      filters.status
    )
  })

  const clearFilters = () => {
    filters.query = ''
    filters.status = ''
    filters.sort.field = 'createdAt'
    filters.sort.direction = 'desc'
    filters.pagination.currentPage = 1
    filters.pagination.pageSize = 10
  }

  initializeFiltersFromUrl()
  syncFiltersToUrl()
  resetPageWhenDatasetChanges()

  return {
    filters,
    hasActiveFilters,
    clearFilters,
  }
  
}