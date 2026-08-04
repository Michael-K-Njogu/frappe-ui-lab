<script setup>
import { ref, computed } from 'vue'
import { useToast } from '../composables/useToast'
import PageTitle from '../components/PageTitle.vue'
import { useRoute, useRouter } from 'vue-router'
import { useOrder } from '../composables/useOrder'
import OrderCard from '../components/orders/OrderCard.vue'
import BaseSkeleton from '../components/base/BaseSkeleton.vue'
import BaseButton from '../components/base/BaseButton.vue'
import { updateOrder, deleteOrder, transitionOrder } from '../services/orderService'
import { ORDER_STATUS } from '../constants/orderStatuses.js'
import { canTransitionTo } from '../business/orderTransitions'
import { getAvailableActions } from '../business/orderPermissions'
import { Play, CheckCheck } from '@lucide/vue'
import BaseConfirmationModal from '../components/base/BaseConfirmationModal.vue'

const ACTION = {
  EDIT: 'edit',
  DELETE: 'delete',
  POST: 'post',
  START_PROCESSING: 'start-processing',
  COMPLETE: 'complete',
  CANCEL: 'cancel',
  PRINT: 'print',
  SHARE: 'share',
}

const route = useRoute()
const router = useRouter()
const { info, error: showError } = useToast()
const showCancelModal = ref(false)

async function performTransition(status, title, message) {
  if (!order.value) return

  try {
    await transitionOrder(
      order.value,
      status
    )

    info(message, {
      title,
    })

    await router.push({
      name: 'orders',
    })

  } catch (err) {
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

const { 
    order, 
    loading, 
    error, 
    deleting,  
    refresh
} = useOrder(route.params.id)

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
      deleteOrder(order.value.id)
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

    case ACTION.CANCEL:
      showCancelModal.value = true
      break

    default:
      console.warn(`Unknown action: ${actionId}`)
  }
}
</script>

<template>
    <PageTitle title="Order Details" :has-back-button="true">
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

    <OrderCard
        v-if="order"
        :order="order"      
    />

    <BaseConfirmationModal
    v-if="order"
    v-model="showCancelModal"
    title="Cancel Order"
    :message="`Are you sure you want to cancel order ${order.orderNumber}? This action cannot be undone.`"
    confirmText="Cancel Order"
    cancelText="Keep Order"
    @confirm="cancelOrder"
    />    
</template>