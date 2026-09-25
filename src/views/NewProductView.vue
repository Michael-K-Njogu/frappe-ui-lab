<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { useToast } from '../composables/useToast'
import { createProduct } from '../services/productService'
import { createProductSchema } from '../validation/productSchema.js'

import ProductForm from '../components/products/ProductForm.vue'

const router = useRouter()
const { success, error: showError } = useToast()

const saving = ref(false)

async function saveProduct(values) {
  saving.value = true

  try {
    const product = await createProduct(values)

    success(`Product ${product.name} created successfully.`, {
      title: 'Product Created',
    })

    await router.push({
      name: 'product-details',
      params: {
        id: product.id,
      },
    })
  } catch (err) {
    showError(err.message || 'Failed to create product.', {
      title: 'Product Not Created',
    })
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <ProductForm
    :validation-schema="createProductSchema"
    :loading="saving"
    @submit="saveProduct"
    @cancel="router.back()"
  />
</template>
