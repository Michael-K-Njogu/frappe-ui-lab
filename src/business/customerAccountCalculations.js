export function calculateAvailableCredit(creditLimit, currentBalance) {
  return Number(creditLimit || 0) - Number(currentBalance || 0)
}

export function calculateProjectedBalance(currentBalance, orderTotal) {
  return Number(currentBalance || 0) + Number(orderTotal || 0)
}

export function calculateProjectedAvailableCredit(creditLimit, currentBalance, orderTotal) {
  return Number(creditLimit || 0) - calculateProjectedBalance(currentBalance, orderTotal)
}
