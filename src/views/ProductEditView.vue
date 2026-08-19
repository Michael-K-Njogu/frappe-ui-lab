<script setup>
import { useRoute, useRouter } from 'vue-router'

import { useProduct } from '../composables/useProduct'
import { updateProductSchema } from '../validation/productSchema.js'
import { useToast } from '../composables/useToast.js'

import PageTitle from '../components/PageTitle.vue'
import ProductForm from '../components/products/ProductForm.vue'
import BaseSkeleton from '../components/base/BaseSkeleton.vue'

const route = useRoute()
const router = useRouter()

const { success, error: showError } = useToast()

const { product, loading, error, saveProduct } = useProduct(route.params.id)

async function update(values) {
  try {
    const updatedProduct = await saveProduct(values)

    success(`Product ${updatedProduct.name} updated successfully.`)

    await router.push({
      name: 'product-details',
      params: {
        id: route.params.id,
      },
    })
  } catch (err) {
    showError(err.message)
  }
}
</script>

<template>
  <PageTitle title="Edit Product" :has-back-button="true" />

  <BaseSkeleton v-if="loading" width="100%" height="1rem" />

  <ProductForm
    v-else-if="product"
    submit-label="Update Product"
    :initial-values="product"
    :loading="loading"
    :error="error"
    :validation-schema="updateProductSchema"
    @submit="update"
    @cancel="router.back()"
  />
</template>
