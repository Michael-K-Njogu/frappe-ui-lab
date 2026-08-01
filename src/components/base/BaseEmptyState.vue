<script setup>
defineProps({
    title: {
        type: String,
        default: 'No Data Available',
        required: true,
    },
    description: {
        type: String,
        default: 'There is no data to display at the moment.',
        required: true,
    },
})
</script>

<template>
    <div class="empty-state">

        <div class="empty-state__icon">
            <slot name="icon">
                <component v-if="icon" :is="icon" size="48" />
            </slot>
        </div>

        <h3 class="empty-state__title">
            {{ title }}
        </h3>

        <p class="empty-state__description">
            {{ description }}
        </p>

        <div class="empty-state__actions">
            <slot name="actions"></slot>
        </div>

    </div>
</template>