<script setup>
import { useRouter } from 'vue-router'
import { createCustomerSchema } from '../validation/customerSchema.js'
import CustomerForm from '../components/customers/CustomerForm.vue'
import { createCustomer } from '../services/customerService'
import PageTitle from '../components/PageTitle.vue'
import { useToast } from '../composables/useToast'

const router = useRouter()
const { success, error: showError } = useToast()

async function saveCustomer(values) {
  try {
    const customer = await createCustomer(values)

    success(`Customer ${customer.name} created successfully.`)

    await router.push({
      name: 'customers',
    })
  } catch (err) {
    showError('Failed to create customer')
  }
}

</script>

<template>
    <PageTitle title="New Customer" :has-back-button="true" />

    <CustomerForm
        :validation-schema="createCustomerSchema"
        :submit-label="'Save Customer'"
        :show-terms="true"
        @submit="saveCustomer"
    />
</template>