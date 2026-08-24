import { createNotification } from '../services/notificationService'
import { useAuth } from '../composables/useAuth'

function getCurrentUserId() {
  const { user } = useAuth()

  if (!user.value?.id) {
    throw new Error('Cannot create notification: no authenticated user found.')
  }

  return user.value.id
}

async function createOrderNotification({ title, message, order }) {
  return createNotification({
    userId: getCurrentUserId(),
    title,
    message,
    type: 'order',
    entityType: 'order',
    entityId: order.id,
    isRead: false,
  })
}

export function notifyOrderPosted(order) {
  return createOrderNotification({
    order,
    title: 'Order Posted',
    message: `Order #${order.orderNumber} has been posted and is awaiting approval.`,
  })
}

export function notifyOrderProcessing(order) {
  return createOrderNotification({
    order,
    title: 'Order Processing',
    message: `Order #${order.orderNumber} is now being processed.`,
  })
}

export function notifyOrderCompleted(order) {
  return createOrderNotification({
    order,
    title: 'Order Completed',
    message: `Order #${order.orderNumber} has been completed successfully.`,
  })
}

export function notifyOrderCanceled(order) {
  return createOrderNotification({
    order,
    title: 'Order Canceled',
    message: `Order #${order.orderNumber} has been canceled.`,
  })
}
