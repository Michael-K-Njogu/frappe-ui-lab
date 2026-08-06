<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// Composables, Services and Utilities
import { useProduct } from '../composables/useProduct'
import { useToast } from '../composables/useToast'
import { SquarePen, Trash2 } from '@lucide/vue'

// Components
import PageTitle from '../components/PageTitle.vue'
import ProductCard from '../components/products/ProductCard.vue'
import BaseConfirmationModal from '../components/base/BaseConfirmationModal.vue'
import BaseSkeleton from '../components/base/BaseSkeleton.vue'
import BaseButton from '../components/base/BaseButton.vue'
import Alert from '../components/Alert.vue'

const open = ref(false)
const route = useRoute()
const router = useRouter()
const { info, error: showError } = useToast()

const { 
    product, 
    loading,
    error,
    deleting,
    deleteProduct
} = useProduct(route.params.id)

async function deleteCurrentProduct() {
  if (!product.value) return

  try {
    await deleteProduct()

    info(
      `Product ${product.value.name} deleted successfully.`
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
    <PageTitle title="Product Details" :has-back-button="true">
        <template #actions>

            <BaseButton
            v-if="product"
            label="Edit"
            variant="secondary"
            @click="
                router.push({
                name: 'product-edit',
                params: {
                    id: product.id,
                },
                })
            "
            >
                <template #icon>
                    <SquarePen size="16" />
                </template>
            </BaseButton>            

            <BaseButton 
                v-if="product"
                label="Delete Product"
                variant="danger"
                :loading="deleting"
            >
                <template #icon>
                    <Trash2 size="16" />
                </template>
            </BaseButton>

        </template>
    </PageTitle>

    <ProductCard
        v-if="product"
        submit-label="Save Product"
        :product="product"
    />
</template>