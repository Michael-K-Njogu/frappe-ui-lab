import { createNotification } from '../services/notificationService'

export async function notifyOrderPosted(order) {
  return createNotification({
    title: 'Order Posted',
    message: `Order #${order.orderNumber} has been posted and is awaiting approval.`,
    type: 'order',
    entityType: 'order',
    entityId: order.id,
    isRead: false,
  })
}

export async function notifyOrderProcessing(order) {
  return createNotification({
    title: 'Order Processing',
    message: `Order #${order.orderNumber} is now being processed.`,
    type: 'order',
    entityType: 'order',
    entityId: order.id,
    isRead: false,
  })
}

export async function notifyOrderCompleted(order) {
  return createNotification({
    title: 'Order Completed',
    message: `Order #${order.orderNumber} has been completed successfully.`,
    type: 'order',
    entityType: 'order',
    entityId: order.id,
    isRead: false,
  })
}

export async function notifyOrderCanceled(order) {
  return createNotification({
    title: 'Order Canceled',
    message: `Order #${order.orderNumber} has been canceled.`,
    type: 'order',
    entityType: 'order',
    entityId: order.id,
    isRead: false,
  })
}
