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
  return ORDER_TIMELINE.map((event) => ({
    ...event,
    title: typeof event.title === 'function' ? event.title(props.order) : event.title,
    timestamp: props.order[event.key],
  })).filter((event) => event.timestamp)
})
</script>

<template>
  <div class="card">
    <div class="card-header">
      <h3>Order Timeline</h3>
    </div>

    <div class="card-body">
      <div v-for="event in timeline" :key="event.key" class="timeline-item">
        <div :class="`timeline-marker ${event.color}`">
          <component :is="event.icon" :size="16" :class="`timeline-icon ${event.color}`" />
        </div>

        <div class="timeline-content">
          <p>{{ event.title }}</p>
          <div class="timeline-date">
            <span class="timeline-date-absolute">
              {{ formatDate(event.timestamp) }}
            </span>

            <span class="timeline-date-relative">
              ({{ formatRelativeDate(event.timestamp) }})
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
