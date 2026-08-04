<script setup>
import { ref, onMounted } from 'vue'
import { getCustomers } from '../services/customerService'
import { useRouter } from 'vue-router'
import { createOrderSchema } from '../validation/orderSchema.js'
import OrderForm from '../components/orders/OrderForm.vue'
import { createOrder } from '../services/orderService'
import PageTitle from '../components/PageTitle.vue'
import { useToast } from '../composables/useToast'
import { generateOrderNumber } from '../utils/orderNumber.js'

const router = useRouter()
const { success, error: showError } = useToast()
const customerOptions = ref([])
const saving = ref(false)

async function loadCustomers() {
  try {
    const { data } = await getCustomers({
      page: 1,
      pageSize: 1000,
    })

    customerOptions.value = data.map(customer => ({
      label: customer.name,
      value: customer.id,
    }))

  } catch (err) {
    showError(err.message)
  }
}

onMounted(() => {
  loadCustomers()
})

async function saveOrder(values) {
  saving.value = true

  try {
    const order = {
      ...values,
      orderNumber: generateOrderNumber(),
    }

    const createdOrder = await createOrder(order)

    success(
      `Order ${createdOrder.orderNumber} created successfully.`
    )

    await router.push({
      name: 'orders',
    })
    
  } catch (err) {
    console.error(err)
    showError(err.message)
  } finally {
    saving.value = false
  }
}
</script>

<template>
    <PageTitle title="Create Order" :has-back-button="true" />

    <OrderForm
        :customer-options="customerOptions"
        :validation-schema="createOrderSchema"
        :loading="saving"
        submit-label="Create Order"
        @submit="saveOrder"
    />
</template>