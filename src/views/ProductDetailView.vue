<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useProduct } from '../composables/useProduct'
import { useToast } from '../composables/useToast'
import { usePermissions } from '../composables/usePermissions'
import { PERMISSION } from '../constants/permissions'

import { SquarePen, Trash2, CircleAlert } from '@lucide/vue'

import PageToolbar from '../layouts/PageToolbar.vue'
import ProductCard from '../components/products/ProductCard.vue'
import BaseConfirmationModal from '../components/base/BaseConfirmationModal.vue'
import BaseSkeleton from '../components/base/BaseSkeleton.vue'
import BaseButton from '../components/base/BaseButton.vue'
import Alert from '../components/Alert.vue'

const showDeleteModal = ref(false)

const route = useRoute()
const router = useRouter()

const { info, error: showError } = useToast()
const { hasPermission } = usePermissions()

const { product, loading, error, deleting, deleteProduct } = useProduct(route.params.id)

const pageTitle = computed(() => {
  if (product.value?.name) {
    return product.value.name
  }

  if (loading.value) {
    return 'Loading...'
  }

  return 'Product Details'
})

function editProduct() {
  if (!product.value) return

  router.push({
    name: 'product-edit',
    params: {
      id: product.value.id,
    },
  })
}

function confirmDeleteProduct() {
  if (!product.value) return

  showDeleteModal.value = true
}

async function deleteCurrentProduct() {
  if (!product.value) return

  const productName = product.value.name

  try {
    await deleteProduct()

    showDeleteModal.value = false

    info(`Product ${productName} deleted successfully.`, {
      title: 'Product Deleted',
    })

    await router.push({
      name: 'products',
    })
  } catch (err) {
    showError(err.message || 'Failed to delete product.')
  }
}
</script>

<template>
  <PageToolbar>
    <template #context>
      <h1>{{ pageTitle }}</h1>
    </template>
    <template #actions>
      <BaseButton
        v-if="product && hasPermission(PERMISSION.PRODUCT_EDIT)"
        label="Edit Product"
        size="sm"
        variant="secondary"
        @click="editProduct"
      >
        <template #icon>
          <SquarePen size="16" />
        </template>
      </BaseButton>

      <BaseButton
        v-if="product && hasPermission(PERMISSION.PRODUCT_DELETE)"
        label="Delete Product"
        variant="danger"
        size="sm"
        :loading="deleting"
        @click="confirmDeleteProduct"
      >
        <template #icon>
          <Trash2 size="16" />
        </template>
      </BaseButton>
    </template>
  </PageToolbar>

  <BaseSkeleton v-if="loading" width="100%" height="20rem" />

  <Alert v-else-if="error" type="danger" :message="error">
    <template #icon>
      <CircleAlert size="18" />
    </template>

    <template #title> Error Loading Product </template>
  </Alert>

  <ProductCard v-else-if="product" :product="product" />

  <BaseConfirmationModal
    v-if="product"
    v-model="showDeleteModal"
    title="Delete Product"
    :message="`Are you sure you want to delete ${product.name}? This action cannot be undone.`"
    confirm-text="Delete Product"
    cancel-text="Cancel"
    :loading="deleting"
    @confirm="deleteCurrentProduct"
  >
    <template #icon>
      <CircleAlert size="24" />
    </template>
  </BaseConfirmationModal>
</template>
