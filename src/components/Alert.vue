<script setup>
import { computed } from 'vue'

const props = defineProps({
  message: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'info',
  },
})

</script>

<template>
    <div class="alert" :class="`alert-${type}`">

        <div class="alert-icon">
            <slot name="icon">
                <component v-if="icon" :is="icon" size="18" />
            </slot>
        </div>

        <div class="alert-content">
            <p>{{ message }}</p>
        </div>

    </div>
</template>