<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

import { CheckCheck, Bell } from '@lucide/vue'

import { useNotifications } from '../composables/useNotifications'
import { getNotificationRoute } from '../utils/notificationNavigation'
import { formatDate } from '../utils/formatters.js'
import { useToast } from '../composables/useToast'

import PageTitle from '../components/PageTitle.vue'
import BaseButton from '../components/base/BaseButton.vue'
import BaseEmptyState from '../components/base/BaseEmptyState.vue'

const router = useRouter()
const { success, error: showError } = useToast()

const { notifications, unreadCount, loading, error, refresh, markAsRead, markAllAsRead } =
  useNotifications()

onMounted(async () => {
  try {
    await refresh({
      limit: 50,
    })
  } catch (err) {
    console.error(err)
  }
})

async function handleNotificationClick(notification) {
  try {
    if (!notification.isRead) {
      await markAsRead(notification.id)
    }

    const route = getNotificationRoute(notification)

    if (route) {
      router.push(route)
    }
  } catch (err) {
    console.error(err)

    showError(err.message || 'Unable to open notification.')
  }
}

function navigateToEntity(notification) {
  switch (notification.entityType) {
    case 'order':
      router.push({
        name: 'order-detail',
        params: {
          id: notification.entityId,
        },
      })
      break

    case 'customer':
      router.push({
        name: 'customer-detail',
        params: {
          id: notification.entityId,
        },
      })
      break

    case 'product':
      router.push({
        name: 'product-detail',
        params: {
          id: notification.entityId,
        },
      })
      break

    default:
      break
  }
}

async function handleMarkAllAsRead() {
  try {
    await markAllAsRead()

    success('All notifications marked as read.')
  } catch (err) {
    console.error(err)

    showError(err.message || 'Unable to mark notifications as read.')
  }
}
</script>

<template>
  <PageTitle title="Notifications" :has-back-button="true">
    <template #actions>
      <BaseButton
        v-if="unreadCount > 0"
        label="Mark all as read"
        variant="secondary"
        @click="handleMarkAllAsRead"
      >
        <template #icon>
          <CheckCheck :size="18" />
        </template>
      </BaseButton>
    </template>
  </PageTitle>

  <div class="notifications-page">
    <div v-if="unreadCount > 0" class="notifications-summary">
      <strong>
        {{ unreadCount }}
      </strong>

      unread notification{{ unreadCount === 1 ? '' : 's' }}
    </div>

    <div v-if="loading" class="notification-page-state">Loading notifications...</div>

    <div v-else-if="error" class="notification-page-state notification-error">
      Unable to load notifications.
    </div>

    <BaseEmptyState
      v-else-if="!notifications.length"
      title="You're all caught up"
      description="There are no notifications to display."
    >
      <template #icon>
        <Bell :size="48" />
      </template>
    </BaseEmptyState>

    <div v-else class="container">
      <ul class="notification-list">
        <li
          v-for="notification in notifications"
          :key="notification.id"
          class="notification-item"
          :class="{
            'is-unread': !notification.isRead,
          }"
          @click="handleNotificationClick(notification)"
        >
          <div class="notification-content">
            <h4>
              {{ notification.title }}
            </h4>
            <span v-if="!notification.isRead" class="unread-label"> Unread </span>

            <p>
              {{ notification.message }}
            </p>

            <time>
              {{ formatDate(notification.createdAt) }}
            </time>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
