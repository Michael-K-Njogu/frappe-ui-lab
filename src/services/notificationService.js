import { apiClient } from '../api/apiClient'

const RESOURCE_PATH = '/notifications'

function mapNotification(notification) {
  return {
    id: notification.id,

    userId: notification.user_id,

    title: notification.title,
    message: notification.message,

    type: notification.type,

    entityType: notification.entity_type,
    entityId: notification.entity_id,

    isRead: notification.is_read,

    createdAt: notification.created_at,
  }
}

function mapNotificationToApi(notification) {
  return {
    user_id: notification.userId,

    title: notification.title,
    message: notification.message,

    type: notification.type,

    entity_type: notification.entityType,
    entity_id: notification.entityId,

    is_read: notification.isRead ?? false,
  }
}

export async function createNotification(notification) {
  const data = await apiClient.post(RESOURCE_PATH, mapNotificationToApi(notification), {
    headers: {
      Prefer: 'return=representation',
    },
  })

  return mapNotification(data[0])
}

export async function getNotifications({ limit = 10, unreadOnly = false, signal } = {}) {
  const params = new URLSearchParams()

  params.set('select', '*')
  params.set('order', 'created_at.desc')
  params.set('limit', limit)

  if (unreadOnly) {
    params.set('is_read', 'eq.false')
  }

  const { data } = await apiClient.getRaw(`${RESOURCE_PATH}?${params.toString()}`, { signal })

  return data.map(mapNotification)
}

export async function getUnreadNotificationCount() {
  const params = new URLSearchParams()

  params.set('select', 'id')
  params.set('is_read', 'eq.false')

  const { response } = await apiClient.getRaw(`${RESOURCE_PATH}?${params.toString()}`, {
    headers: {
      Prefer: 'count=exact',
    },
  })

  const contentRange = response.headers.get('content-range')

  return contentRange ? Number(contentRange.split('/')[1]) : 0
}

export async function markNotificationAsRead(id) {
  const data = await apiClient.patch(
    `${RESOURCE_PATH}?id=eq.${id}`,
    {
      is_read: true,
    },
    {
      headers: {
        Prefer: 'return=representation',
      },
    },
  )

  return mapNotification(data[0])
}

export async function markAllNotificationsAsRead() {
  await apiClient.patch(`${RESOURCE_PATH}?is_read=eq.false`, {
    is_read: true,
  })
}
