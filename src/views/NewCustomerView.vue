<script setup>
import { useRouter } from 'vue-router'
import { createCustomerSchema } from '../validation/customerSchema.js'
import CustomerForm from '../components/customers/CustomerForm.vue'
import { createCustomer } from '../services/customerService'
import PageTitle from '../components/PageTitle.vue'

const router = useRouter()

async function saveCustomer(values) {
  try {
    const customer = await createCustomer(values)

    await router.push({
      name: 'customers',
    })
  } catch (err) {
    console.error(err)
  }
}

</script>

<template>
    <PageTitle title="New Customer" />

    <CustomerForm
        :validation-schema="createCustomerSchema"
        :submit-label="'Save Customer'"
        :show-terms="true"
        @submit="saveCustomer"
    />
</template>