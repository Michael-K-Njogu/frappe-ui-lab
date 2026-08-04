<script setup>
import { ref, onMounted } from 'vue'
import { getCustomers } from '../services/customerService'
import { useRouter } from 'vue-router'
import { createOrderSchema } from '../validation/orderSchema.js'
import OrderForm from '../components/orders/OrderForm.vue'
import { createOrder } from '../services/orderService'
import PageTitle from '../components/PageTitle.vue'
import { useToast } from '../composables/useToast'
import { ORDER_STATUS } from '../constants/orderStatuses.js'

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

async function saveOrder(values, status) {
  saving.value = true

  try {
    const order = {
      ...values,
      status,
    }     

    if (status === ORDER_STATUS.PENDING) {
      order.postedAt = new Date().toISOString()
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

async function saveDraft(values) {
  await saveOrder(
    values,
    ORDER_STATUS.DRAFT
  )
}

async function postOrder(values) {
  await saveOrder(
    values,
    ORDER_STATUS.PENDING
  )
}
</script>

<template>
    <PageTitle title="Create Order" :has-back-button="true" />

    <OrderForm
        :customer-options="customerOptions"
        :validation-schema="createOrderSchema"
        :loading="saving"
        submit-label="Create Order"
        @save-draft="saveDraft"
        @post-order="postOrder"
    />
</template>