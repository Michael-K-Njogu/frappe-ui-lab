<script setup>
import { useRouter } from 'vue-router'

// Components
import PageTitle from '../components/PageTitle.vue'
import ProductForm from '../components/products/ProductForm.vue'

// Composables
import { useToast } from '../composables/useToast'

// Services
import { createProduct } from '../services/productService'

// Validation
import { createProductSchema } from '../validation/productSchema'

const router = useRouter()
const { success, error: showError } = useToast()

/* Handle product form submission */
async function saveProduct(values) {
  try {
    const product = await createProduct(values)

    success(
        console.log(values),
      `Product ${product.name} created successfully.`
    )

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
        :schema="createProductSchema"
        @submit="saveProduct"
        @cancel="() => router.back()"
    />

</template>