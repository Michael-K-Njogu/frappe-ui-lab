<script setup>
import { useRouter, useRoute } from 'vue-router'
import { updateCustomerSchema } from '../validation/customerSchema.js'
import CustomerForm from '../components/customers/CustomerForm.vue'
import { useCustomer } from '../composables/useCustomer.js'
import { updateCustomer } from '../services/customerService.js'
import PageTitle from '../components/PageTitle.vue'
import { useToast } from '../composables/useToast.js'

const router = useRouter()
const route = useRoute()
const { success, error } = useToast()

const {
  customer,
  loading,
  error: fetchError,
} = useCustomer(route.params.id)

async function saveCustomer(values) {
  try {
    const updatedCustomer = await updateCustomer(
      route.params.id,
      values
    )

    success(`Customer ${updatedCustomer.name} updated successfully.`, {
      duration: 3000,
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
    error('Failed to update customer')
  }
}

</script>

<template>
    <PageTitle title="Edit Customer" :has-back-button="true" />

    <p v-if="loading">Loading...</p>
    <p v-if="fetchError">{{ fetchError.message }}</p>

    <CustomerForm
        v-else-if="customer"
        :validation-schema="updateCustomerSchema"
        :submit-label="'Update Customer'"
        :initial-values="customer"
        @submit="saveCustomer"
    />
</template>