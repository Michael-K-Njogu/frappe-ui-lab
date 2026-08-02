<script setup>
defineProps({
    label: {
        type: String,
        required: true,
    },
    variant: {
        type: String,
        default: 'primary',
    },
    type: {
        type: String,
        default: 'button',
    },
    ariaLabel: {
        type: String,
        default: '',
    },
    size: {
        type: String,
        default: 'lg',
    },
})
</script>

<template>
    <button :type="type" :class="`btn btn-${variant} btn-${size}`">
        {{ label }}
    </button>
</template>