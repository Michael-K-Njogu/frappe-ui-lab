// src/utils/notificationNavigation.js

export function getNotificationRoute(notification) {
  if (!notification?.entityType || !notification?.entityId) {
    return null
  }

  switch (notification.entityType) {
    case 'order':
      return {
        name: 'order-detail',
        params: {
          id: notification.entityId,
        },
      }

    case 'customer':
      return {
        name: 'customer-detail',
        params: {
          id: notification.entityId,
        },
      }

    case 'product':
      return {
        name: 'product-detail',
        params: {
          id: notification.entityId,
        },
      }

    default:
      return null
  }
}
