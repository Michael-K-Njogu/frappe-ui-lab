import { ref, computed } from 'vue'

import { supabase } from '../api/supabaseClient'

import {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '../services/notificationService'

// Shared application state
const notifications = ref([])
const loading = ref(false)
const error = ref(null)

const unreadCount = computed(
  () => notifications.value.filter((notification) => !notification.isRead).length,
)

let notificationChannel = null

export function useNotifications() {
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

  function subscribeToNotifications(userId) {
    if (!userId || notificationChannel) return

    notificationChannel = supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        async () => {
          try {
            await refresh({ limit: 10 })
          } catch (err) {
            console.error('Failed to refresh notifications:', err)
          }
        },
      )
      .subscribe()
  }

  async function unsubscribeFromNotifications() {
    if (!notificationChannel) return

    await supabase.removeChannel(notificationChannel)
    notificationChannel = null
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
    subscribeToNotifications,
    unsubscribeFromNotifications,
    markAsRead,
    markAllAsRead,
  }
}
