import { ref, computed, watch } from 'vue'
import { getCustomers } from '../services/customerService'

const savedSearch = localStorage.getItem('searchTerm')
const searchTerm = ref(savedSearch || '')

let timeoutID = null

watch(searchTerm, (value) => {
  if (timeoutID) {
    clearTimeout(timeoutID)
  }
  timeoutID = setTimeout(() => {
    localStorage.setItem('searchTerm', value)
  }, 500)
})

export function useCustomers() {
  const customers = ref([])
  const loading = ref(false)
  const error = ref(null)

  const filteredCustomers = computed(() => {
    return customers.value.filter(customer =>
      customer.name
        .toLowerCase()
        .includes(searchTerm.value.toLowerCase())
    )
  })

  async function loadCustomers() {
    loading.value = true
    error.value = null

    try {
      customers.value = await getCustomers()
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  return {
    customers,
    filteredCustomers,
    searchTerm,
    loading,
    error,
    loadCustomers,
  }
}