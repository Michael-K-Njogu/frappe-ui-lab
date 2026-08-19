import { ref, watch } from 'vue'

import {
  getOrderItemsByOrder,
  createOrderItem,
  updateOrderItem,
  deleteOrderItem,
} from '../services/orderItemService'

export function useOrderItems(orderId) {
  const orderItems = ref([])

  const loading = ref(false)
  const saving = ref(false)
  const deleting = ref(false)

  const error = ref(null)

  async function refresh() {
    if (!orderId) {
      orderItems.value = []
      return
    }

    loading.value = true
    error.value = null

    try {
      orderItems.value = await getOrderItemsByOrder(orderId)
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  async function addOrderItem(orderItem) {
    saving.value = true

    try {
      const created = await createOrderItem(orderItem)

      await refresh()

      return created
    } finally {
      saving.value = false
    }
  }

  async function saveOrderItem(id, updates) {
    saving.value = true

    try {
      const updated = await updateOrderItem(id, updates)

      await refresh()

      return updated
    } finally {
      saving.value = false
    }
  }

  async function removeOrderItem(id) {
    deleting.value = true

    try {
      await deleteOrderItem(id)

      await refresh()
    } finally {
      deleting.value = false
    }
  }

  watch(() => orderId, refresh, {
    immediate: true,
  })

  return {
    orderItems,
    loading,
    saving,
    deleting,
    error,
    refresh,
    addOrderItem,
    saveOrderItem,
    removeOrderItem,
  }
}
