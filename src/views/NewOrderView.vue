<script setup>
import { useRouter } from 'vue-router'
import { createOrderSchema } from '../validation/orderSchema.js'
import OrderForm from '../components/orders/OrderForm.vue'
import { createOrder } from '../services/orderService'
import PageTitle from '../components/PageTitle.vue'
import { useToast } from '../composables/useToast'

const router = useRouter()

const { success, error: showError } = useToast()

async function saveOrder(values) {
  try {
    const order = await createOrder(values)

    success(`Order ${order.id} created successfully.`)

    await router.push({
      name: 'orders',
    })
  } catch (err) {
    showError('Failed to create order')
  }
}
</script>

<template>
    <PageTitle title="New Order" :has-back-button="true" />

    <OrderForm
        :validation-schema="createOrderSchema"
        @submit="saveOrder"
    />
</template>