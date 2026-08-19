import { ref, computed } from 'vue'

import {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '../services/notificationService'

export function useNotifications() {
  const notifications = ref([])
  const loading = ref(false)
  const error = ref(null)

  const unreadCount = computed(
    () => notifications.value.filter((notification) => !notification.isRead).length,
  )

  async function refresh({ limit = 10, unreadOnly = false } = {}) {
    loading.value = true
    error.value = null

    try {
      const [latestNotifications, count] = await Promise.all([
        getNotifications({
          limit,
          unreadOnly,
        }),
        getUnreadNotificationCount(),
      ])

      notifications.value = latestNotifications

      return {
        notifications: latestNotifications,
        unreadCount: count,
      }
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  async function markAsRead(id) {
    try {
      const updated = await markNotificationAsRead(id)

      const index = notifications.value.findIndex((notification) => notification.id === id)

      if (index !== -1) {
        notifications.value[index] = updated
      }

      return updated
    } catch (err) {
      error.value = err
      throw err
    }
  }

  async function markAllAsRead() {
    try {
      await markAllNotificationsAsRead()

      notifications.value = notifications.value.map((notification) => ({
        ...notification,
        isRead: true,
      }))
    } catch (err) {
      error.value = err
      throw err
    }
  }

  return {
    notifications,
    unreadCount,
    loading,
    error,

    refresh,
    markAsRead,
    markAllAsRead,
  }
}
