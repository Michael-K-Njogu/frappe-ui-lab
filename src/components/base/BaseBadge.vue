<script setup>
defineProps({
    variant: {
        type: String,
        default: 'default',
    },
})
</script>

<template>
    <span class="badge" :class="`badge--${variant}`">
        <slot />   
    </span>
</template>