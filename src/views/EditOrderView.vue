<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { ORDER_STATUS } from '../constants/orderStatuses.js'

import { calculateGrandTotal } from '../business/orderCalculations.js'
import { canEditOrder } from '../business/orderPermissions.js'

import { updateOrderSchema } from '../validation/orderSchema.js'

import { useToast } from '../composables/useToast'
import { useOrder } from '../composables/useOrder'
import { useOrderItems } from '../composables/useOrderItems'
import { getOrderById } from '../services/orderService'
import { updateOrder } from '../services/orderService'
import { getOrderItemsByOrder } from '../services/orderItemService'
import { getCustomers, getCustomerAccountSummary } from '../services/customerService'

import PageTitle from '../components/PageTitle.vue'
import OrderForm from '../components/orders/OrderForm.vue'

const route = useRoute()
const router = useRouter()
const { success, error: showError } = useToast()
const customerOptions = ref([])
const order = ref(null)
const orderItems = ref([])
const originalOrderItems = ref([])
const loading = ref(true)
const saving = ref(false)
const customerAccount = ref(null)
const loadingCustomerAccount = ref(false)

const { addOrderItem, saveOrderItem, removeOrderItem } = useOrderItems()

async function loadCustomerAccount(customerId) {
  customerAccount.value = null

  if (!customerId) {
    return
  }

  loadingCustomerAccount.value = true

  try {
    customerAccount.value = await getCustomerAccountSummary(customerId)
  } catch (err) {
    console.error(err)

    showError(err.message || 'Unable to load customer account information.')
  } finally {
    loadingCustomerAccount.value = false
  }
}

async function loadCustomers() {
  try {
    const { data } = await getCustomers({
      page: 1,
      pageSize: 1000,
    })

    customerOptions.value = data.map((customer) => ({
      label: customer.name,
      value: customer.id,
      meta: `${customer.customerType} · ${customer.creditLimit}`,
    }))
  } catch (err) {
    showError(err.message)
  }
}

async function loadOrder() {
  loading.value = true

  try {
    order.value = await getOrderById(route.params.id)

    await loadCustomerAccount(order.value.customerId)

    const items = await getOrderItemsByOrder(order.value.id)

    orderItems.value = items

    originalOrderItems.value = items.map((item) => ({
      ...item,
    }))
  } catch (err) {
    console.error(err)
    showError(err.message)
  } finally {
    loading.value = false
  }
}

async function saveOrderItems(items) {
  const originalItemsById = new Map(originalOrderItems.value.map((item) => [item.id, item]))

  const currentItemIds = new Set(items.filter((item) => !item.isTemporary).map((item) => item.id))

  // 1. Delete items that existed originally but
  // are no longer present in the form.
  for (const originalItem of originalOrderItems.value) {
    if (!currentItemIds.has(originalItem.id)) {
      await removeOrderItem(originalItem.id)
    }
  }

  // 2. Create new items or update existing items.
  for (const item of items) {
    // New item
    if (item.isTemporary) {
      const { id, isTemporary, ...itemData } = item

      await addOrderItem({
        ...itemData,
        orderId: order.value.id,
      })

      continue
    }

    const originalItem = originalItemsById.get(item.id)

    if (!originalItem) {
      continue
    }

    // Existing item — check whether anything changed
    const hasChanged =
      Number(item.quantity) !== Number(originalItem.quantity) ||
      Number(item.discount || 0) !== Number(originalItem.discount || 0) ||
      Number(item.lineTotal || 0) !== Number(originalItem.lineTotal || 0)

    if (hasChanged) {
      await saveOrderItem(item.id, {
        quantity: item.quantity,
        discount: item.discount,
        lineTotal: item.lineTotal,
      })
    }
  }
} // end of saveOrderItems

async function saveOrder(values, status) {
  saving.value = true

  try {
    const { orderItems: items = [], ...orderValues } = values

    await updateOrder(order.value.id, {
      ...orderValues,
      status,
      ...(status === ORDER_STATUS.PENDING ? { postedAt: new Date().toISOString() } : {}),
    })

    await saveOrderItems(items)

    const allOrderItems = await getOrderItemsByOrder(order.value.id)

    const grandTotal = calculateGrandTotal(allOrderItems)

    await updateOrder(order.value.id, {
      totalAmount: grandTotal,
    })

    success(
      status === ORDER_STATUS.PENDING
        ? `Order ${order.value.orderNumber} posted successfully.`
        : `Order ${order.value.orderNumber} saved successfully.`,
    )

    router.push({
      name: 'orders',
    })
  } catch (err) {
    console.error(err)
    showError(err.message || 'An error occurred while updating the order.')
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  loading.value = true

  try {
    await Promise.all([loadCustomers(), loadOrder()])
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
})

async function saveDraft(values) {
  await saveOrder(values, ORDER_STATUS.DRAFT)
}

async function postOrder(values) {
  await saveOrder(values, ORDER_STATUS.PENDING)
}

function deleteItem(item) {
  success(`${item.productName} removed from the order.`)
}

function handleClearAllItems() {
  success('All items removed from the order.')
}
</script>

<template>
  <PageTitle :title="`Edit Order #${order ? order.orderNumber : ''}`" :has-back-button="true" />

  <div v-if="loading">
    <p>Loading order...</p>
  </div>

  <OrderForm
    v-if="order"
    :initial-values="order"
    :initial-order-items="orderItems"
    :customer-options="customerOptions"
    :customer-account="customerAccount"
    :loading-customer-account="loadingCustomerAccount"
    :validation-schema="updateOrderSchema"
    :editable="canEditOrder(order)"
    submit-label="Submit Order"
    :loading="saving"
    @post-order="postOrder"
    @save-draft="saveDraft"
    @delete-item="deleteItem"
    @clear-items="handleClearAllItems"
  />
</template>
