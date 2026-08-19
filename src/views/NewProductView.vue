<script setup>
import { useRouter } from 'vue-router'

import { useToast } from '../composables/useToast'
import { createProduct } from '../services/productService'
import { createProductSchema } from '../validation/productSchema.js'

import PageTitle from '../components/PageTitle.vue'
import ProductForm from '../components/products/ProductForm.vue'

const router = useRouter()
const { success, error: showError } = useToast()

/* Handle product form submission */
async function saveProduct(values) {
  try {
    const product = await createProduct(values)

    success(`Product ${product.name} created successfully.`)

    await router.push({
      name: 'products',
    })
  } catch (err) {
    showError(err.message)
  }
}
</script>

<template>
  <PageTitle title="New Product" :has-back-button="true" />

  <ProductForm
    :validation-schema="createProductSchema"
    @submit="saveProduct"
    @cancel="() => router.back()"
  />
</template>
