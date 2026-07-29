// 

import { apiClient } from '../api/apiClient'

function mapCustomer(customer) {
  return {
    id: customer.id,
    name: customer.name,
    email: customer.email,
    creditLimit: customer.credit_limit,
    customerType: customer.customer_type,
    createdAt: customer.created_at,
  }
}

function mapCustomerToApi(customer) {
  return {
    name: customer.name,
    email: customer.email,
    credit_limit: customer.creditLimit,
    customer_type: customer.customerType,
  }
} 

export async function getCustomers({
  query = '',
  customerType = '',
  sort,
  page = 1,
  limit = 10,
} = {}) {

  const params = new URLSearchParams()
  params.set('select', '*')

  if (query) {
    params.set(
      'or',
      `(name.ilike.*${query}*,email.ilike.*${query}*)`
    )
  }

  const customers = await apiClient.get(
    `/customers?${params.toString()}`
  )

  return customers.map(mapCustomer)
}

export async function getCustomerById(id) {
  const customers = await apiClient.get(
    `/customers?id=eq.${id}&select=*`
  )
  return customers.length > 0 ? mapCustomer(customers[0]) : null
}

export async function createCustomer(customer) {
  const createdCustomers = await apiClient.post(
    '/customers',
    mapCustomerToApi(customer),
    {
      headers: {
        Prefer: 'return=representation',
      },
    }
  )

  return mapCustomer(createdCustomers[0])
}

export async function updateCustomer(id, customer) { 

  const updatedCustomers = await apiClient.patch(
    `/customers?id=eq.${id}`,
    mapCustomerToApi(customer),
    {
      headers: {
        Prefer: 'return=representation',
      },
    }
  )

   return mapCustomer(updatedCustomers[0])
}

export async function deleteCustomer(id) {
  await apiClient.delete(`/customers?id=eq.${id}`)
}