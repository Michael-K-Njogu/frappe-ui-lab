// Handlers

import { http, HttpResponse } from 'msw'
import { customerRepository } from './data/customerRepository'

const API_BASE_URL = import.meta.env.VITE_API_URL

export const handlers = [
  http.get(`${API_BASE_URL}/customers`, () => {
    return HttpResponse.json(customerRepository.getAll())
  }),

  http.post(`${API_BASE_URL}/customers`, async ({ request }) => {
    const customer = await request.json()

    const savedCustomer = customerRepository.create(customer)

    return HttpResponse.json(savedCustomer, { status: 201 })
  }),
]
