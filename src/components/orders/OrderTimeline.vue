<script setup>
import { computed } from 'vue'
import { formatDate, formatRelativeDate } from '../../utils/formatters'
import { ORDER_TIMELINE } from '../../constants/orderTimeline'

const props = defineProps({
  order: {
    type: Object,
    required: true,
  },
})

const timeline = computed(() => {
  return ORDER_TIMELINE.map((event) => {
    const timestamp = props.order[event.key]

    const statusByKey = {
      createdAt: 'DRAFT',
      postedAt: 'PENDING',
      processingStartedAt: 'PROCESSING',
      completedAt: 'COMPLETED',
      canceledAt: 'CANCELED',
    }

    return {
      ...event,
      title: typeof event.title === 'function' ? event.title(props.order) : event.title,

      timestamp,
      status: statusByKey[event.key],

      isCompleted: Boolean(timestamp),
      isCurrent: statusByKey[event.key] === props.order.status,
    }
  }).filter((event) => {
    // Always show the order creation event
    if (event.key === 'createdAt') {
      return true
    }

    // For cancelled orders, show only events that happened
    // plus the cancellation event.
    if (props.order.status === 'CANCELED') {
      return Boolean(event.timestamp)
    }

    // Hide the cancellation path for non-cancelled orders
    if (event.key === 'canceledAt') {
      return false
    }

    // Show completed events and the next/current lifecycle stage
    return true
  })
})
</script>

<template>
  <div class="card">
    <div class="card-header">
      <h3>Order Timeline</h3>
    </div>

    <div class="card-body">
      <div class="order-timeline">
        <div
          v-for="(event, index) in timeline"
          :key="event.key"
          class="timeline-item"
          :class="{
            'is-completed': event.isCompleted,
            'is-current': event.isCurrent,
            'is-upcoming': event.isUpcoming,
          }"
        >
          <div class="timeline-track">
            <div
              class="timeline-marker"
              :class="[
                event.color,
                {
                  'is-completed': event.isCompleted,
                  'is-current': event.isCurrent,
                  'is-upcoming': event.isUpcoming,
                },
              ]"
            >
              <component :is="event.icon" :size="16" class="timeline-icon" />
            </div>

            <div
              v-if="index < timeline.length - 1"
              class="timeline-line"
              :class="{
                'is-completed': event.isCompleted,
              }"
            />
          </div>

          <div class="timeline-content">
            <div class="timeline-title-row">
              <p class="timeline-title">
                {{ event.title }}
              </p>

              <span v-if="event.isCurrent" class="timeline-current-label"> Current </span>
            </div>

            <div v-if="event.timestamp" class="timeline-date">
              <span>
                {{ formatDate(event.timestamp) }}
              </span>

              <span class="timeline-date-relative">
                {{ formatRelativeDate(event.timestamp) }}
              </span>
            </div>

            <p v-else-if="event.isUpcoming" class="timeline-pending">Not yet reached</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
