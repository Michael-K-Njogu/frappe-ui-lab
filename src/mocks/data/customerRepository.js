import { seedCustomers } from '../seed/customers'

const STORAGE_KEY = 'customers'

function initialize() {
    if(!localStorage.getItem(STORAGE_KEY)) {
        localStorage.setItem(
            STORAGE_KEY, 
            JSON.stringify(seedCustomers)
        )
    }
}

initialize()

function getAll() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY))
}

function save(customers) {
    localStorage.setItem(
        STORAGE_KEY, 
        JSON.stringify(customers)
    )
}

export const customerRepository = {
    getAll,

    create(customer) {
        const customers = getAll()

        const newCustomer = {
            id: crypto.randomUUID(),
            ...customer,
        }

        customers.push(newCustomer)
        save(customers)

        return newCustomer
    }
}