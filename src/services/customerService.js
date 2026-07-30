import { apiClient } from '../api/apiClient'

const SORT_FIELD_MAP = {
  name: 'name',
  email: 'email',
  customerType: 'customer_type',
  creditLimit: 'credit_limit',
  createdAt: 'created_at',
}

export const CUSTOMER_FIELDS = {
  id: 'id',
  name: 'name',
  email: 'email',
  creditLimit: 'credit_limit',
  customerType: 'customer_type',
  createdAt: 'created_at',
}

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
  pageSize = 10,
} = {}) {

  const params = new URLSearchParams()
  const offset = (page - 1) * pageSize
  params.set('offset', offset)
  params.set('limit', pageSize)
  params.set('select', '*')
  
  if (query) {
    params.set(
      'or',
      `(name.ilike.*${query}*,email.ilike.*${query}*)`
    )
  }

  if (customerType) {
    params.set(
      CUSTOMER_FIELDS.customerType,
      `eq.${customerType}`)
  }

  const dbSortField = SORT_FIELD_MAP[sort.field]

  if (dbSortField) {
    params.set(
      'order',
      `${dbSortField}.${sort.direction}`
    )
  }

  const { data, response } = await apiClient.getRaw(
    `/customers?${params.toString()}`,
    {
      headers: {
        Prefer: 'count=exact',
      },
    }
  )  

  const contentRange = response.headers.get('content-range')
  const total = contentRange 
    ? Number(contentRange.split('/')[1]) // Extract total count from content-range header
    : 0 // Default to 0 if content-range header is not present

  return {
    data: data.map(mapCustomer),
    total,
  }
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