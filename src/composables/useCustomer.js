import { ref, onMounted } from 'vue'
import {
  getCustomerById,
  deleteCustomer as deleteCustomerService,
} from '../services/customerService'

export function useCustomer(customerId) {
  const customer = ref(null)
  const loading = ref(false)
  const deleting = ref(false)
  const error = ref(null)

  async function loadCustomer() {
    loading.value = true
    error.value = null

    try {
      customer.value = await getCustomerById(customerId)
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function deleteCustomer() {
    deleting.value = true
    error.value = null

    try {
      await deleteCustomerService(customerId)
    } catch (err) {
      error.value = err.message
      throw err // Rethrow the error so that the caller can handle it if needed
    } finally {
      deleting.value = false
    }
  }

  onMounted(loadCustomer)

  return {
    customer,
    loading,
    error,
    deleting,
    refresh: loadCustomer,
    deleteCustomer,
  }
}
