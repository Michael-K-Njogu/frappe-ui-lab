<script setup>
import { useRouter, useRoute } from 'vue-router'
import { updateCustomerSchema } from '../validation/customerSchema.js'
import CustomerForm from '../components/customers/CustomerForm.vue'
import { useCustomer } from '../composables/useCustomer.js'
import { updateCustomer } from '../services/customerService.js'
import PageTitle from '../components/PageTitle.vue'

const router = useRouter()
const route = useRoute()

const {
  customer,
  loading,
  error,
} = useCustomer(route.params.id)

async function saveCustomer(values) {
  try {
    const updatedCustomer = await updateCustomer(
      route.params.id,
      values
    )

    await router.push({
      name: 'customer-details',
      params: {
        id: updatedCustomer.id,
      },
    })
  } catch (err) {
    console.error(err)
  }
}

</script>

<template>
    <PageTitle title="Edit Customer" />

    <p v-if="loading">Loading...</p>
    <p v-if="error">{{ error.message }}</p>

    <CustomerForm
        v-else-if="customer"
        :validation-schema="updateCustomerSchema"
        :submit-label="'Update Customer'"
        :initial-values="customer"
        @submit="saveCustomer"
    />
</template>