<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { canDeleteCustomer } from '../business/customerPermissions'
import { useCustomer } from '../composables/useCustomer'
import { useToast } from '../composables/useToast'
import { usePermissions } from '../composables/usePermissions'
import { PERMISSION } from '../constants/permissions'

import PageToolbar from '../layouts/PageToolbar.vue'
import { SquarePen, Trash2 } from '@lucide/vue'
import CustomerCard from '../components/customers/CustomerCard.vue'
import BaseButton from '../components/base/BaseButton.vue'
import BaseConfirmationModal from '../components/base/BaseConfirmationModal.vue'
import BaseSkeleton from '../components/base/BaseSkeleton.vue'

const open = ref(false)
const route = useRoute()
const router = useRouter()
const { info, error: showError } = useToast()
const { hasPermission } = usePermissions()

const canDelete = computed(() => {
  return customer.value ? canDeleteCustomer(customer.value) : false
})

function confirmDeleteCustomer() {
  if (!hasPermission(PERMISSION.CUSTOMER_DELETE)) {
    showError('You do not have permission to delete customers.')
    return
  }

  if (!canDelete.value) {
    showError('This customer cannot be deleted because they have existing orders.')
    return
  }

  open.value = true
}

async function handleDelete() {
  if (!hasPermission(PERMISSION.CUSTOMER_DELETE)) {
    showError('You do not have permission to delete customers.')
    return
  }

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
    showError(err.message)
  }
}

const deleteMessage = computed(() => {
  if (customer.value) {
    return `Are you sure you want to delete ${customer.value.name} from the database? This action cannot be undone.`
  }
  return ''
})

const { customer, loading, error, deleting, deleteCustomer } = useCustomer(route.params.id)
</script>

<template>
  <PageToolbar>
    <template #context>
      <h1>
        {{ customer ? customer.name : 'Customer Details' }}
      </h1>
    </template>
    <template #actions>
      <BaseButton
        v-if="customer && hasPermission(PERMISSION.CUSTOMER_EDIT)"
        label="Edit Customer"
        size="sm"
        @click="router.push({ name: 'customer-edit', params: { id: customer.id } })"
        variant="secondary"
      >
        <template #icon>
          <SquarePen size="16" />
        </template>
      </BaseButton>

      <BaseButton
        v-if="customer && canDelete && hasPermission(PERMISSION.CUSTOMER_DELETE)"
        label="Delete Customer"
        variant="danger"
        size="sm"
        :loading="deleting"
        :disabled="deleting"
        @click="confirmDeleteCustomer"
      >
        <template #icon>
          <Trash2 size="16" />
        </template>
      </BaseButton>
    </template>
  </PageToolbar>

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
