import { apiClient } from "../api/apiClient";
import { mapOrderItem, mapOrderItemToApi } from "../mappers/OrderItemMapper";

const RESOURCE_PATH = "/order_items";

export async function getOrderItems() {
    const data = await apiClient.get(RESOURCE_PATH)

    return data.map(mapOrderItem)
}

export async function getOrderItemById(id) {
    const data = await apiClient.getById(
        RESOURCE_PATH,
        id
    )

    return mapOrderItem(data)
}

export async function getOrderItemsByOrder(orderId) {
    const params = new URLSearchParams()

    params.set('order_id', `eq.${orderId}`)
    params.set('select', '*')
    params.set('order', 'created_at.asc')

    const data = await apiClient.get(
        `${RESOURCE_PATH}?${params.toString()}`
    )

    return data.map(mapOrderItem)
}

export async function createOrderItem(orderItem) {
    const apiOrderItem = mapOrderItemToApi(orderItem)

    const data = await apiClient.post(
        RESOURCE_PATH,
        apiOrderItem,
        {
            headers: {
                Prefer: 'return=representation',
            },
        }
    )

    return mapOrderItem(data[0])
}

// Update an existing order item - future enhancement: Instead of reusing mapOrderItemToApi(), build the payload directly
export async function updateOrderItem(id, updates) {
    const apiOrderItem = mapOrderItemToApi(updates)

    const data = await apiClient.patch(
        `${RESOURCE_PATH}?id=eq.${id}`,
        apiOrderItem,
        {
            headers: {
                Prefer: 'return=representation',
            },
        }
    )

    return mapOrderItem(data[0])
}

export async function deleteOrderItem(id) {
    await apiClient.delete(
        `${RESOURCE_PATH}?id=eq.${id}`
    )
}