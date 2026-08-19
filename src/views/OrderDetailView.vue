<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useToast } from '../composables/useToast'
import { useOrder } from '../composables/useOrder'
import { useOrderItems } from '../composables/useOrderItems'

import { updateOrder, deleteOrder, transitionOrder, updateOrderGrandTotal } from '../services/orderService'
import { getCustomerById } from '../services/customerService'

import { ORDER_STATUS, ORDER_STATUS_TIMESTAMP_FIELD } from '../constants/orderStatuses.js'
import { canTransitionTo } from '../business/orderTransitions'
import { getAvailableActions } from '../business/orderPermissions'
import { calculateLineTotal } from '../business/orderItemCalculations.js'
import { calculateSubtotal, calculateDiscount, calculateGrandTotal, calculateTotalItems,} from '../business/orderCalculations'

import PageTitle from '../components/PageTitle.vue'
import OrderCard from '../components/orders/OrderCard.vue'
import OrderTimeline from '../components/orders/OrderTimeline.vue'
import OrderItemTable from '../components/order-items/OrderItemTable.vue'
import AddOrderItemModal from '../components/order-items/AddOrderItemModal.vue'
import BaseSkeleton from '../components/base/BaseSkeleton.vue'
import BaseButton from '../components/base/BaseButton.vue'
import BaseConfirmationModal from '../components/base/BaseConfirmationModal.vue'

import InvoiceDocument from '../components/invoices/InvoiceDocument.vue'
import InvoicePreviewPanel from '../components/invoices/InvoicePreviewPanel.vue'

import { Play, CheckCheck, Plus, Printer, Share2, Eye } from '@lucide/vue'

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
const customer = ref(null)

function previewInvoice() {
  showInvoicePreview.value = true
}

async function performTransition(status, title, message) {
    if (!order.value) return

    if (!canTransitionTo(order.value.status, status)) {
        showError(
            `Order cannot be changed from ${order.value.status} to ${status}.`
        )
        return
    }

    try {
        const updatedOrder = {
            ...order.value,
            status,
        }

        const timestampField =
            ORDER_STATUS_TIMESTAMP_FIELD[status]

        if (timestampField) {
            updatedOrder[timestampField] =
                new Date().toISOString()
        }

        await transitionOrder(
            updatedOrder,
            status
        )

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

async function postOrder() {
  await performTransition(
    ORDER_STATUS.PENDING,
    'Order Posted',
    `Order ${order.value.orderNumber} has been posted for approval.`
  )
}

async function startProcessing() {
  await performTransition(
    ORDER_STATUS.PROCESSING,
    'Order Updated',
    `Order ${order.value.orderNumber} is now processing.`
  )
}

async function completeOrder() {
  await performTransition(
    ORDER_STATUS.COMPLETED,
    'Order Completed',
    `Order ${order.value.orderNumber} has been completed.`
  )
}

async function cancelOrder() {
  await performTransition(
    ORDER_STATUS.CANCELED,
    'Order Canceled',
    `Order ${order.value.orderNumber} has been canceled.`
  )

  showCancelModal.value = false
}

async function handleDeleteOrder() {
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

const { 
    order, 
    loading, 
    error, 
    deleting,  
    refresh
} = useOrder(route.params.id)

watch(
    () => order.value?.customerId,
    async (customerId) => {
        if (!customerId) {
            customer.value = null
            return
        }

        try {
            customer.value =
                await getCustomerById(customerId)
        } catch (err) {
            console.error(
                'Failed to load customer:',
                err
            )

            showError(
                err.message ||
                'Unable to load customer information.'
            )
        }
    },
    {
        immediate: true,
    }
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

const subtotal = computed(() =>
  calculateSubtotal(orderItems.value)
)

const totalDiscount = computed(() =>
  calculateDiscount(orderItems.value)
)

const grandTotal = computed(() =>
  calculateGrandTotal(orderItems.value)
)

const totalItems = computed(() =>
  calculateTotalItems(orderItems.value)
)

const lineTotal = computed(() =>
  calculateLineTotal({
    quantity: quantity.value,
    unitPrice: unitPrice.value,
    discount: discount.value,
  })
)

async function createOrderItem(values) {
  try {
    const existingItem = orderItems.value.find(
      item => item.productId === values.productId
    )

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

    await refreshOrderTotals()

    showAddItemModal.value = false

  } catch (err) {
    showError(err.message)
    console.error('Error creating order item:', err)
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
        visible: actions.value.canEdit,
    },
    {
        id: ACTION.DELETE,
        label: 'Delete',
        variant: 'danger',
        visible: actions.value.canDelete,
    },
    {
        id: ACTION.POST,
        label: 'Post Order',
        variant: 'primary',
        visible: actions.value.canPost,
    },
    {
        id: ACTION.START_PROCESSING,
        label: 'Start Processing',
        variant: 'primary',
        visible: actions.value.canStartProcessing,
        icon: Play,
    },
    {
        id: ACTION.COMPLETE,
        label: 'Complete Order',
        variant: 'primary',
        visible: actions.value.canComplete,
        icon: CheckCheck,
    },
    {
        id: ACTION.CANCEL,
        label: 'Cancel Order',
        variant: 'danger',
        visible: actions.value.canCancel,
    },
    {
        id: ACTION.PREVIEW,
        label: 'Preview',
        variant: 'secondary',
        visible: actions.value.canPreview,
        icon: Eye,
    },
    {
        id: ACTION.PRINT,
        label: 'Export / Print',
        variant: 'primary',
        visible: actions.value.canPrint,
        icon: Printer,
    },    
    {
        id: ACTION.SHARE,
        label: 'Share',
        variant: 'secondary',
        visible: actions.value.canShare,  
        icon: Share2,
    }
  ].filter(action => action.visible)
})

function handleAction(actionId) {
  switch (actionId) {

    case ACTION.EDIT:
      router.push({
        name: 'order-edit',
        params: {
          id: order.value.id,
        },
      })
      break

    case ACTION.DELETE:
      showDeleteModal.value = true
      break

    case ACTION.START_PROCESSING:
      startProcessing()
      break

    case ACTION.POST:
      postOrder()
      break

    case ACTION.COMPLETE:
      completeOrder()
      break

    case ACTION.PREVIEW:
      previewInvoice()
      break

    case ACTION.CANCEL:
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
  if(!order.value) return

  await updateOrderGrandTotal(
    order.value.id,
    grandTotal.value
  )

  await refresh()
}

const pageTitle = computed(() => {
    if (order.value?.orderNumber) {
        return `Order #${order.value.orderNumber}`
    } else if (loading.value) {
        return 'Loading...'
    } else {
        return 'Order Details'
    }
})
</script>

<template>
    <PageTitle 
      :title="pageTitle"
      :has-back-button="true"
      >
        <template #actions>

            <BaseButton
                v-for="button in actionButtons"
                :key="button.id"
                :label="button.label"
                :variant="button.variant"
                :loading="loading"
                @click="handleAction(button.id)"
            >
                <template
                v-if="button.icon"
                #icon
                >
                  <component
                      :is="button.icon"
                      size="20"
                  />
                </template>

            </BaseButton>          
            
        </template>
    </PageTitle>

    <div class="row">

      <div class="column">
        <OrderCard
            v-if="order"
            :order="order"    
            :summary="summary"
        />
      </div>

      <div class="column">
        <OrderTimeline
          v-if="order"
          :order="order"
        />   
        </div>        
      </div> 

<div class="card">

  <div class="card-header">

      <h3>
        Order Items
      </h3>

      <BaseButton
        v-if="actions.canEdit"
        id="add-order-item"
        name="add-order-item"
        label="Add Item"
        size="sm"
        @click="showAddItemModal = true"
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
      :editable="actions.canEdit"
    >

      <template #actions>

        <BaseButton
          label="Add First Item"
          @click="showAddItemModal = true"
        />

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

  <AddOrderItemModal
    :open="showAddItemModal"
    :loading="savingOrderItems"
    @close="showAddItemModal = false"
    @submit="createOrderItem"
  />   

  <InvoicePreviewPanel
      v-if="order"
      :open="showInvoicePreview"
      :order="order"
      :items="orderItems"
      :customer="customer"
      @close="showInvoicePreview = false"
  />

</template>