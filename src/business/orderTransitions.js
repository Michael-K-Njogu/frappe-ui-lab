import { ORDER_STATUS } from '../constants/orderStatus'

export const ORDER_TRANSITIONS = {
  [ORDER_STATUS.DRAFT]: [
    ORDER_STATUS.PENDING,
  ],

  [ORDER_STATUS.PENDING]: [
    ORDER_STATUS.PROCESSING,
    ORDER_STATUS.CANCELLED,
  ],

  [ORDER_STATUS.PROCESSING]: [
    ORDER_STATUS.COMPLETED,
  ],

  [ORDER_STATUS.COMPLETED]: [],

  [ORDER_STATUS.CANCELLED]: [],
}

export function getAllowedTransitions(status) {
  return ORDER_TRANSITIONS[status] ?? []
}

export function canTransitionTo(current, next) {
  const allowedTransitions = getAllowedTransitions(current)
  return allowedTransitions.includes(next)
}