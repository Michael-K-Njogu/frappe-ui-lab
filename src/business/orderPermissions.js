import { ORDER_STATUS } from '../constants/orderStatuses.js'
import { canTransitionTo } from './orderTransitions.js'

export function canEditOrder(order) {
  return order.status === ORDER_STATUS.DRAFT
}

export function canDeleteOrder(order) {
  return order.status === ORDER_STATUS.DRAFT
}

export function canCancelOrder(order) {
    return canTransitionTo(
        order.status,
        ORDER_STATUS.CANCELED
    )
}

export function canPostOrder(order) {
  return order.status === ORDER_STATUS.DRAFT
}

export function canPrintOrder(order) {
  return order.status === ORDER_STATUS.COMPLETED
}

export function canPreviewInvoice(order) {
  return order.status === ORDER_STATUS.COMPLETED
}

export function canStartProcessing(order) {
  return canTransitionTo(
    order.status, 
    ORDER_STATUS.PROCESSING
  )
}

export function canCompleteOrder(order) {
  return canTransitionTo(
    order.status, 
    ORDER_STATUS.COMPLETED
  )
}

export function getAvailableActions(order) {
  return {
    canEdit: canEditOrder(order),
    canDelete: canDeleteOrder(order),
    canCancel: canCancelOrder(order),
    canPost: canPostOrder(order),
    canPrint: canPrintOrder(order),
    canPreview: canPreviewInvoice(order),
    canStartProcessing: canStartProcessing(order),
    canComplete: canCompleteOrder(order),
  }
}

export function getEditRestrictionReason(order) {
  switch (order.status) {
    case ORDER_STATUS.PENDING:
      return 'Posted orders cannot be edited.'

    case ORDER_STATUS.PROCESSING:
      return 'Orders being processed cannot be edited.'

    case ORDER_STATUS.COMPLETED:
      return 'Completed orders are read-only.'

    case ORDER_STATUS.CANCELED:
      return 'Canceled orders cannot be edited.'

    default:
      return null
  }
}