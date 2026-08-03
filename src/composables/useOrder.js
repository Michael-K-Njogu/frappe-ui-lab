import { ref, onMounted } from 'vue'
import { getOrderById, deleteOrder as deleteOrderService } from '../services/orderService'

export function useOrder(orderId) {

    const order = ref(null)
    const loading = ref(false)
    const deleting = ref(false)
    const error = ref(null)

    async function loadOrder() {
        loading.value = true
        error.value = null

        try {
            order.value = await getOrderById(orderId)
        } catch (err) {
            error.value = err.message
        } finally {
            loading.value = false
        }
    }

    async function deleteOrder() {
        deleting.value = true
        error.value = null

        try {
            await deleteOrderService(orderId)
            order.value = null
        } catch (err) {
            error.value = err.message
            throw err // Rethrow the error so that the caller can handle it if needed
        } finally {
            deleting.value = false
        }
    }

    onMounted(loadOrder)

    return {
        order,
        loading,
        error,
        refresh: loadOrder,
        deleteOrder: async () => {
            loading.value = true
            error.value = null

            try {
                await deleteOrderService(orderId)
                order.value = null
            } catch (err) {
                error.value = err.message
            } finally {
                loading.value = false
            }
        },
    }
}