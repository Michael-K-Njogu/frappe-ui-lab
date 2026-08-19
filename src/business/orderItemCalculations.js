/**
 * Calculates the total value of a single order line.
 *
 * @param {Object} params
 * @param {number} params.quantity
 * @param {number} params.unitPrice
 * @param {number} [params.discount=0]
 * @returns {number}
 */
export function calculateLineTotal({ quantity, unitPrice, discount = 0 }) {
  const qty = Number(quantity) || 0
  const price = Number(unitPrice) || 0
  const disc = Number(discount) || 0

  return Math.max(0, qty * price - disc)
}
