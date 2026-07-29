import { ref, onMounted } from 'vue'
import { getCustomerById } from '../services/customerService'

export function useCustomer(id) {
    
    const customer = ref(null)
    const loading = ref(false)
    const error = ref(null) 

    async function loadCustomer() {
    loading.value = true
    error.value = null
    
    try {
      customer.value = await getCustomerById(id)
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  onMounted(loadCustomer)

  return {
    customer,
    loading,
    error,
    reload: loadCustomer
  }
}