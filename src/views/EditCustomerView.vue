<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import { updateCustomerSchema } from '../validation/customerSchema.js'
import { useCustomer } from '../composables/useCustomer.js'
import { updateCustomer } from '../services/customerService.js'
import { deleteCustomerImage } from '../services/storageService.js'

import BaseButton from '../components/base/BaseButton.vue'
import CustomerForm from '../components/customers/CustomerForm.vue'
import PageTitle from '../components/PageTitle.vue'
import { useToast } from '../composables/useToast.js'

const router = useRouter()
const route = useRoute()
const { success, error: showError } = useToast()
const saving = ref(false)

const { customer, loading, error: fetchError } = useCustomer(route.params.id)

async function saveCustomer(values) {
  if (saving.value) return
  saving.value = true
  try {
    const updatedCustomer = await updateCustomer(route.params.id, values)

    success(`Customer ${updatedCustomer.name} updated successfully.`, {
      title: 'Customer Updated',
    })

    await router.push({
      name: 'customer-details',
      params: {
        id: updatedCustomer.id,
      },
    })
  } catch (err) {
    console.error(err)

    showError(err.message || 'Failed to update customer.')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <PageTitle title="Edit Customer" :has-back-button="true" />

  <p v-if="loading">Loading...</p>

  <CustomerForm
    v-else-if="customer"
    :validation-schema="updateCustomerSchema"
    :submit-label="'Update Customer'"
    :initial-values="customer"
    :loading="saving"
    @submit="saveCustomer"
  />
</template>
