import { ref, onMounted } from 'vue'

import {
  getProductById,
  updateProduct,
  deleteProduct,
} from '../services/productService'

export function useProduct(id) {
  const product = ref(null)
  const loading = ref(false)
  const deleting = ref(false)
  const error = ref(null)

  async function loadProduct() {
    loading.value = true
    error.value = null

    try {
      product.value = await getProductById(id)
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }  

  async function refresh() {
    await loadProduct()
  }
  
  async function saveProduct(values) {
    loading.value = true
    error.value = null

    try {
      product.value = await updateProduct(
        id,
        values
      )

      return product.value

    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function removeProduct() {
    deleting.value = true
    error.value = null

    try {
      await deleteProduct(id)

    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      deleting.value = false
    }
  }
  
  onMounted(loadProduct)

    return {
    product,
    loading,
    deleting,
    error,
    refresh,
    saveProduct,
    removeProduct,
  }
}