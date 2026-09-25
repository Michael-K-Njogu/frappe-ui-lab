<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useToast } from '../composables/useToast'
import { useOrder } from '../composables/useOrder'
import { useOrderItems } from '../composables/useOrderItems'

import {
  updateOrder,
  deleteOrder,
  transitionOrder,
  updateOrderGrandTotal,
} from '../services/orderService'
import { getCustomerById } from '../services/customerService'

import { ORDER_STATUS, ORDER_STATUS_TIMESTAMP_FIELD } from '../constants/orderStatuses.js'
import { canTransitionTo } from '../business/orderTransitions'
import { getAvailableActions } from '../business/orderPermissions'
import { calculateLineTotal } from '../business/orderItemCalculations.js'
import {
  calculateSubtotal,
  calculateDiscount,
  calculateGrandTotal,
  calculateTotalItems,
} from '../business/orderCalculations'
import {
  notifyOrderPosted,
  notifyOrderProcessing,
  notifyOrderCompleted,
  notifyOrderCanceled,
} from '../business/orderNotifications'
import { printInvoice } from '../utils/printInvoice.js'

import { usePermissions } from '../composables/usePermissions'
import { PERMISSION } from '../constants/permissions'

import PageToolbar from '../layouts/PageToolbar.vue'
import OrderCard from '../components/orders/OrderCard.vue'
import OrderTimeline from '../components/orders/OrderTimeline.vue'
import OrderItemTable from '../components/order-items/OrderItemTable.vue'
import AddOrderItemModal from '../components/order-items/AddOrderItemModal.vue'
import BaseSkeleton from '../components/base/BaseSkeleton.vue'
import BaseButton from '../components/base/BaseButton.vue'
import BaseConfirmationModal from '../components/base/BaseConfirmationModal.vue'

import InvoiceDocument from '../components/invoices/InvoiceDocument.vue'
import InvoicePreviewPanel from '../components/invoices/InvoicePreviewPanel.vue'

import {
  CirclePlay,
  CheckCheck,
  Plus,
  Printer,
  Share2,
  Eye,
  X,
  Send,
  SquarePen,
  Trash2,
} from '@lucide/vue'

const ACTION = {
  EDIT: 'edit',
  DELETE: 'delete',
  POST: 'post',
  START_PROCESSING: 'start-processing',
  COMPLETE: 'complete',
  CANCEL: 'cancel',
  PREVIEW: 'preview',
  PRINT: 'print',
  SHARE: 'share',
}

const route = useRoute()
const router = useRouter()
const { info, error: showError } = useToast()
const showCancelModal = ref(false)
const showAddItemModal = ref(false)
const showDeleteModal = ref(false)
const showInvoicePreview = ref(false)

const selectedOrderItem = ref(null)
const editingOrderItem = ref(null)
const showEditItemModal = ref(false)
const showDeleteItemModal = ref(false)

const customer = ref(null)
const { hasPermission } = usePermissions()

const canEditOrder = computed(() => {
  return actions.value.canEdit && hasPermission(PERMISSION.ORDER_EDIT)
})

function previewInvoice() {
  if (!requirePermission(PERMISSION.ORDER_VIEW)) return

  showInvoicePreview.value = true
}

function handlePrintInvoice() {
  if (!requirePermission(PERMISSION.ORDER_PRINT)) return

  try {
    printInvoice()
  } catch (err) {
    console.error(err)
    showError(err.message || 'Unable to print invoice.')
  }
}

async function performTransition(status, title, message, notify) {
  if (!order.value) return

  if (!canTransitionTo(order.value.status, status)) {
    showError(`Order cannot be changed from ${order.value.status} to ${status}.`)
    return
  }

  try {
    const updatedOrder = {
      ...order.value,
      status,
    }

    const timestampField = ORDER_STATUS_TIMESTAMP_FIELD[status]

    if (timestampField) {
      updatedOrder[timestampField] = new Date().toISOString()
    }

    await transitionOrder(updatedOrder, status)

    if (notify) {
      try {
        await notify(updatedOrder)
      } catch (notificationError) {
        console.error('Failed to create notification:', notificationError)
      }
    }

    info(message, {
      title,
    })

    await router.push({
      name: 'orders',
    })
  } catch (err) {
    console.error(err)
    showError(err.message)
  }
}

function requirePermission(permission, message) {
  if (hasPermission(permission)) {
    return true
  }

  showError(message || 'You do not have permission to perform this action.')
  return false
}

async function postOrder() {
  if (!requirePermission(PERMISSION.ORDER_POST)) return

  await performTransition(
    ORDER_STATUS.PENDING,
    'Order Posted',
    `Order ${order.value.orderNumber} has been posted for approval.`,
    notifyOrderPosted,
  )
}

async function startProcessing() {
  if (!requirePermission(PERMISSION.ORDER_PROCESS)) return

  await performTransition(
    ORDER_STATUS.PROCESSING,
    'Order Updated',
    `Order ${order.value.orderNumber} is now processing.`,
    notifyOrderProcessing,
  )
}

async function completeOrder() {
  if (!requirePermission(PERMISSION.ORDER_COMPLETE)) return

  await performTransition(
    ORDER_STATUS.COMPLETED,
    'Order Completed',
    `Order ${order.value.orderNumber} has been completed.`,
    notifyOrderCompleted,
  )
}

async function cancelOrder() {
  if (!requirePermission(PERMISSION.ORDER_CANCEL)) return

  await performTransition(
    ORDER_STATUS.CANCELED,
    'Order Canceled',
    `Order ${order.value.orderNumber} has been canceled.`,
    notifyOrderCanceled,
  )

  showCancelModal.value = false
}

async function handleDeleteOrder() {
  if (!requirePermission(PERMISSION.ORDER_DELETE)) return

  try {
    await deleteOrder(order.value.id)

    info('Order deleted successfully.', {
      title: 'Order Deleted',
    })

    router.push({
      name: 'orders',
    })
  } catch (err) {
    showError(err.message)
  }
}

const { order, loading, error, deleting, refresh } = useOrder(route.params.id)

watch(
  () => order.value?.customerId,
  async (customerId) => {
    if (!customerId) {
      customer.value = null
      return
    }

    try {
      customer.value = await getCustomerById(customerId)
    } catch (err) {
      console.error('Failed to load customer:', err)

      showError(err.message || 'Unable to load customer information.')
    }
  },
  {
    immediate: true,
  },
)

const {
  orderItems,
  loading: loadingOrderItems,
  saving: savingOrderItems,

  addOrderItem,
  saveOrderItem,
  removeOrderItem,

  refresh: refreshOrderItems,
} = useOrderItems(route.params.id)

const subtotal = computed(() => calculateSubtotal(orderItems.value))

const totalDiscount = computed(() => calculateDiscount(orderItems.value))

const grandTotal = computed(() => calculateGrandTotal(orderItems.value))

const totalItems = computed(() => calculateTotalItems(orderItems.value))

async function handleOrderItemSubmit(values) {
  if (!requirePermission(PERMISSION.ORDER_EDIT)) return

  try {
    if (selectedOrderItem.value) {
      await saveOrderItem(selectedOrderItem.value.id, {
        ...selectedOrderItem.value,
        ...values,
        lineTotal: calculateLineTotal({
          quantity: values.quantity,
          unitPrice: values.unitPrice,
          discount: values.discount,
        }),
      })

      info('Order item updated successfully.', {
        title: 'Order Updated',
      })
    } else {
      const existingItem = orderItems.value.find((item) => item.productId === values.productId)

      if (existingItem) {
        const mergedQuantity = Number(existingItem.quantity) + Number(values.quantity)

        const mergedDiscount = Number(existingItem.discount) + Number(values.discount)

        await saveOrderItem(existingItem.id, {
          ...existingItem,
          quantity: mergedQuantity,
          discount: mergedDiscount,
          lineTotal: calculateLineTotal({
            quantity: mergedQuantity,
            unitPrice: existingItem.unitPrice,
            discount: mergedDiscount,
          }),
        })

        info('Product quantity updated successfully.', {
          title: 'Order Updated',
        })
      } else {
        await addOrderItem({
          ...values,
          orderId: order.value.id,
        })

        info('Product added to the order successfully.', {
          title: 'Order Updated',
        })
      }
    }

    await refreshOrderItems()
    await refreshOrderTotals()

    selectedOrderItem.value = null
    showAddItemModal.value = false
  } catch (err) {
    console.error('Error saving order item:', err)

    showError(err.message || 'Unable to save order item.')
  }
}

const actions = computed(() => {
  if (!order.value) {
    return {}
  }

  return getAvailableActions(order.value)
})

const actionButtons = computed(() => {
  if (!order.value) return []

  return [
    {
      id: ACTION.EDIT,
      label: 'Edit',
      variant: 'secondary',
      visible: actions.value.canEdit && hasPermission(PERMISSION.ORDER_EDIT),
      icon: SquarePen,
    },
    {
      id: ACTION.DELETE,
      label: 'Delete',
      variant: 'danger',
      visible: actions.value.canDelete && hasPermission(PERMISSION.ORDER_DELETE),
      icon: Trash2,
    },
    {
      id: ACTION.POST,
      label: 'Post Order',
      variant: 'primary',
      visible: actions.value.canPost && hasPermission(PERMISSION.ORDER_POST),
      icon: Send,
    },
    {
      id: ACTION.START_PROCESSING,
      label: 'Start Processing',
      variant: 'primary',
      visible: actions.value.canStartProcessing && hasPermission(PERMISSION.ORDER_PROCESS),
      icon: CirclePlay,
    },
    {
      id: ACTION.COMPLETE,
      label: 'Complete Order',
      variant: 'primary',
      visible: actions.value.canComplete && hasPermission(PERMISSION.ORDER_COMPLETE),
      icon: CheckCheck,
    },
    {
      id: ACTION.CANCEL,
      label: 'Cancel Order',
      variant: 'danger',
      visible: actions.value.canCancel && hasPermission(PERMISSION.ORDER_CANCEL),
      icon: X,
    },
    {
      id: ACTION.PREVIEW,
      label: 'Preview',
      variant: 'secondary',
      visible: actions.value.canPreview && hasPermission(PERMISSION.ORDER_VIEW),
      icon: Eye,
    },
    {
      id: ACTION.PRINT,
      label: 'Export / Print',
      variant: 'secondary',
      visible: actions.value.canPrint && hasPermission(PERMISSION.ORDER_PRINT),
      icon: Printer,
    },
    {
      id: ACTION.SHARE,
      label: 'Share',
      variant: 'secondary',
      visible: actions.value.canShare && hasPermission(PERMISSION.ORDER_SHARE),
      icon: Share2,
    },
  ].filter((action) => action.visible)
})

function handleAction(actionId) {
  switch (actionId) {
    case ACTION.EDIT:
      if (!requirePermission(PERMISSION.ORDER_EDIT)) return
      router.push({
        name: 'order-edit',
        params: {
          id: order.value.id,
        },
      })
      break

    case ACTION.DELETE:
      if (!requirePermission(PERMISSION.ORDER_DELETE)) return
      showDeleteModal.value = true
      break

    case ACTION.START_PROCESSING:
      if (!requirePermission(PERMISSION.ORDER_PROCESS)) return
      startProcessing()
      break

    case ACTION.POST:
      if (!requirePermission(PERMISSION.ORDER_POST)) return
      postOrder()
      break

    case ACTION.COMPLETE:
      if (!requirePermission(PERMISSION.ORDER_COMPLETE)) return
      completeOrder()
      break

    case ACTION.PREVIEW:
      previewInvoice()
      break

    case ACTION.PRINT:
      handlePrintInvoice()
      break

    case ACTION.CANCEL:
      if (!requirePermission(PERMISSION.ORDER_CANCEL)) return
      showCancelModal.value = true
      break

    default:
      console.warn(`Unknown action: ${actionId}`)
  }
}

const summary = computed(() => ({
  totalItems: calculateTotalItems(orderItems.value),
  subtotal: calculateSubtotal(orderItems.value),
  totalDiscount: calculateDiscount(orderItems.value),
  grandTotal: calculateGrandTotal(orderItems.value),
}))

async function refreshOrderTotals() {
  if (!order.value) return

  await updateOrderGrandTotal(order.value.id, grandTotal.value)

  await refresh()
}

const pageTitle = computed(() => {
  if (order.value?.orderNumber) {
    return order.value.orderNumber ? order.value.orderNumber : 'Order Details'
  } else if (loading.value) {
    return 'Loading order details...'
  } else {
    return 'Order Details'
  }
})

function handleEditOrderItem(item) {
  if (!requirePermission(PERMISSION.ORDER_EDIT)) return

  editingOrderItem.value = item
  showEditItemModal.value = true
}

async function handleDeleteOrderItem() {
  if (!selectedOrderItem.value) return

  if (!requirePermission(PERMISSION.ORDER_EDIT)) return

  try {
    await removeOrderItem(selectedOrderItem.value.id)

    await refreshOrderTotals()

    info('Product removed from the order successfully.', {
      title: 'Order Updated',
    })

    showDeleteItemModal.value = false
    selectedOrderItem.value = null
  } catch (err) {
    console.error('Error deleting order item:', err)

    showError(err.message || 'Unable to remove product from the order.')
  }
}

function handleCloseOrderItemModal() {
  showAddItemModal.value = false
  selectedOrderItem.value = null
}
</script>

<template>
  <PageToolbar>
    <template #context>
      <h1>{{ pageTitle }}</h1>
      <span v-if="order" :class="`badge badge--${order.status.toLowerCase()}`">{{
        order.status
      }}</span>
    </template>
    <template #actions>
      <BaseButton
        v-for="button in actionButtons"
        :key="button.id"
        :label="button.label"
        :variant="button.variant"
        :loading="loading"
        @click="handleAction(button.id)"
        size="sm"
      >
        <template v-if="button.icon" #icon>
          <component :is="button.icon" size="16" />
        </template>
      </BaseButton>
    </template>
  </PageToolbar>

  <div class="row">
    <div class="column">
      <OrderCard v-if="order" :order="order" :summary="summary" />
    </div>

    <div class="column">
      <OrderTimeline v-if="order" :order="order" />
    </div>
  </div>

  <div class="card">
    <div class="card-header">
      <h3>Order Items</h3>

      <BaseButton
        v-if="canEditOrder"
        id="add-order-item"
        name="add-order-item"
        label="Add Item"
        size="sm"
        @click="((selectedOrderItem = null), (showAddItemModal = true))"
      >
        <template #icon>
          <Plus size="20" />
        </template>
      </BaseButton>
    </div>

    <div class="card-body">
      <OrderItemTable
        :items="orderItems"
        :loading="loadingOrderItems"
        :editable="canEditOrder"
        @edit="handleEditOrderItem"
        @delete="handleDeleteOrderItem"
      >
        <template #actions>
          <BaseButton v-if="canEditOrder" label="Add First Item" @click="showAddItemModal = true">
            <template #icon>
              <Plus size="20" />
            </template>
          </BaseButton>
        </template>
      </OrderItemTable>
    </div>
  </div>

  <BaseConfirmationModal
    v-if="order"
    v-model="showCancelModal"
    title="Cancel Order"
    :message="`Are you sure you want to cancel order ${order.orderNumber}? This action cannot be undone.`"
    confirmText="Cancel Order"
    cancelText="Keep Order"
    @confirm="cancelOrder"
  />

  <BaseConfirmationModal
    v-if="order"
    v-model="showDeleteModal"
    title="Delete Order"
    :message="`Are you sure you want to delete order ${order.orderNumber}? This action cannot be undone.`"
    confirmText="Delete Order"
    cancelText="Keep Order"
    @confirm="handleDeleteOrder"
  />

  <BaseConfirmationModal
    v-if="selectedOrderItem"
    v-model="showDeleteItemModal"
    title="Remove Product"
    :message="`Are you sure you want to remove ${selectedOrderItem.productName} from this order?`"
    confirmText="Remove Product"
    cancelText="Keep Product"
    @confirm="handleDeleteOrderItem"
  />

  <AddOrderItemModal
    :key="selectedOrderItem?.id ?? 'new'"
    :open="showAddItemModal"
    :loading="savingOrderItems"
    :mode="selectedOrderItem ? 'edit' : 'new'"
    :initial-values="selectedOrderItem"
    @close="handleCloseOrderItemModal"
    @submit="handleOrderItemSubmit"
  />

  <InvoicePreviewPanel
    v-if="order"
    :open="showInvoicePreview"
    :order="order"
    :items="orderItems"
    :customer="customer"
    @close="showInvoicePreview = false"
  />

  <div id="invoice-print-container">
    <InvoiceDocument
      v-if="order && customer"
      :order="order"
      :items="orderItems"
      :customer="customer"
    />
  </div>
</template>

<style scoped>
#invoice-print-container {
  display: none;
}
</style>
