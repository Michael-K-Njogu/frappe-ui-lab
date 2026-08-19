/* Customer Permissions */

export function canDeleteCustomer(customer) {
  return customer.orderCount === 0
}

export function canEditCustomer(customer) {
  return true // All customers can be edited
}
