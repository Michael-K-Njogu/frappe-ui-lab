import { ORDER_STATUS } from '../constants/orderStatuses.js'

export function canEditOrder(order) {
    return order.status === ORDER_STATUS.DRAFT
}

export function canDeleteOrder(order) {
    return order.status === ORDER_STATUS.DRAFT
}

export function canCancelOrder(order) {
    return order.status === ORDER_STATUS.PENDING
}

export function canPostOrder(order) {
    return order.status === ORDER_STATUS.DRAFT
}

export function canPrintOrder(order) {
    return order.status === ORDER_STATUS.COMPLETED
}

export function canShareOrder(order) {
    return order.status === ORDER_STATUS.COMPLETED
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