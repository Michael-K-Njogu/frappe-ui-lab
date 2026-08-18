<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import { ORDER_STATUS } from '../constants/orderStatuses.js'

import { calculateGrandTotal } from '../business/orderCalculations.js'

import { createOrderSchema } from '../validation/orderSchema.js'

import { useToast } from '../composables/useToast'
import { useOrderItems } from '../composables/useOrderItems'

import { getCustomers, getCustomerAccountSummary } from '../services/customerService'
import { createOrder, updateOrderGrandTotal } from '../services/orderService'

import PageTitle from '../components/PageTitle.vue'
import OrderForm from '../components/orders/OrderForm.vue'


const router = useRouter()
const { success, error: showError } = useToast()
const customerOptions = ref([])
const customerAccount = ref(null)
const loadingCustomerAccount = ref(false)
const saving = ref(false)

const {
  addOrderItem,
} = useOrderItems()

async function loadCustomers() {
  try {
    const { data } = await getCustomers({
      page: 1,
      pageSize: 1000,
    })

    customerOptions.value = data.map(customer => ({
      label: customer.name,
      value: customer.id,
      meta: `${customer.customerType} · ${customer.creditLimit}`,
    }))

  } catch (err) {
    showError(err.message)
  }
}

onMounted(() => {
  loadCustomers()
})

// Load customer account information when a customer is selected
async function loadCustomerAccount(customerId) {
    customerAccount.value = null

    if (!customerId) {
        return
    }

    loadingCustomerAccount.value = true

    try {
        customerAccount.value =
            await getCustomerAccountSummary(customerId)
    } catch (err) {
        console.error(err)
        showError(
            err.message ||
            'Unable to load customer account information.'
        )
    } finally {
        loadingCustomerAccount.value = false
    }
}

async function saveOrder(values, status) {
  saving.value = true

  try {
    const {
      orderItems = [],
      ...orderValues
    } = values

    const order = {
      ...orderValues,
      status,
    }

    if (status === ORDER_STATUS.PENDING) {
      order.postedAt = new Date().toISOString()
    }

    const createdOrder = await createOrder(order)

    for (const item of orderItems) {
      await addOrderItem({
        orderId: createdOrder.id,
        productId: item.productId,
        sku: item.sku,
        productName: item.productName,
        unit: item.unit,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discount: item.discount,
        lineTotal: item.lineTotal,
      })
    }

    const grandTotal = calculateGrandTotal(orderItems)
    
    await updateOrderGrandTotal(
      createdOrder.id, 
      grandTotal
    )

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
        :customer-account="customerAccount"
        :loading-customer-account="loadingCustomerAccount"
        :validation-schema="createOrderSchema"
        :loading="saving"
        submit-label="Create Order"
        @save-draft="saveDraft"
        @post-order="postOrder"
        @customer-change="loadCustomerAccount"
    />
</template>