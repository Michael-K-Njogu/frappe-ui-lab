/**
 * Calculates the subtotal before discounts.
 */
export function calculateSubtotal(orderItems) {
  return orderItems.reduce(
    (total, item) =>
      total + (Number(item.quantity) * Number(item.unitPrice)),
    0
  )
}

/**
 * Calculates the total discount across all order items.
 */
export function calculateDiscount(orderItems) {
  return orderItems.reduce(
    (total, item) =>
      total + Number(item.discount || 0),
    0
  )
}

/**
 * Calculates the grand total after discounts.
 */
export function calculateGrandTotal(orderItems) {
  return orderItems.reduce(
    (total, item) =>
      total + Number(item.lineTotal || 0),
    0
  )
}

/**
 * Calculates the total quantity of items on the order.
 */
export function calculateTotalItems(orderItems) {
  return orderItems.reduce(
    (total, item) =>
      total + Number(item.quantity || 0),
    0
  )
}