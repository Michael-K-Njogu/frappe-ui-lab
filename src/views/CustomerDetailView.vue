<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { canDeleteCustomer } from '../business/customerPermissions'
import { useCustomer } from '../composables/useCustomer'
import { useToast } from '../composables/useToast'

import PageTitle from '../components/PageTitle.vue'
import { ArrowLeft, Pencil, Trash2, Info } from '@lucide/vue'
import CustomerCard from '../components/customers/CustomerCard.vue'
import BaseButton from '../components/base/BaseButton.vue'
import BaseConfirmationModal from '../components/base/BaseConfirmationModal.vue'
import BaseSkeleton from '../components/base/BaseSkeleton.vue'
import Alert from '../components/Alert.vue'

const open = ref(false)
const route = useRoute()
const router = useRouter()
const { info, error: showError } = useToast()

const canDelete = computed(() => {
  return customer.value ? canDeleteCustomer(customer.value) : false
})

function confirmDeleteCustomer() {
  if (!canDelete.value) {
    showError('This customer cannot be deleted because they have existing orders.')
    return
  }
  open.value = true
}

async function handleDelete() {
  try {
    await deleteCustomer()

    open.value = false

    info('The customer has been successfully deleted.', {
      title: 'Customer Deleted',
    })

    router.push({
      name: 'customers',
    })
  } catch (err) {
    showError(err.message) // Display the error message in a toast notification
  }
}

const deleteMessage = computed(() => {
  if (customer.value) {
    return `Are you sure you want to delete ${customer.value.name} from the database? This action cannot be undone.`
  }
  return ''
})

const { customer, loading, error, deleting, refresh, deleteCustomer } = useCustomer(route.params.id)
</script>

<template>
  <PageTitle title="Customer Details" :has-back-button="true">
    <template #actions>
      <RouterLink
        v-if="customer"
        :to="{ name: 'customer-edit', params: { id: customer.id } }"
        class="btn btn-secondary"
      >
        <Pencil size="16" />
        Edit Customer
      </RouterLink>

      <BaseButton
        v-if="customer && canDelete"
        label="Delete Customer"
        variant="danger"
        @click="confirmDeleteCustomer"
      >
        <template #icon>
          <Trash2 size="16" />
        </template>
      </BaseButton>
    </template>
  </PageTitle>

  <p v-if="error">
    {{ error }}
  </p>

  <CustomerCard v-if="customer" :customer="customer" />

  <BaseConfirmationModal
    v-if="customer"
    v-model="open"
    title="Confirm Deletion"
    :message="deleteMessage"
    confirmText="Delete"
    cancelText="Cancel"
    :loading="deleting"
    @confirm="handleDelete"
  />

  <BaseSkeleton v-if="loading" width="100%" height="1rem" />
</template>

<style scoped>
.alert {
  margin-bottom: 1rem;
}
</style>
