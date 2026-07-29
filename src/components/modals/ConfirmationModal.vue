<script setup>
defineProps({
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    loading: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['confirm', 'cancel'])
</script>

<template>
    <div class="modal-backdrop">

        <div class="modal">
            <h2>{{ title }}</h2>
            <p>{{ message }}</p>

            <div class="modal-actions">
                <button class="btn btn-secondary" :disabled="loading" @click="emit('cancel')">Cancel</button>
                <button class="btn btn-danger" :disabled="loading" @click="emit('confirm')">{{ loading ? 'Deleting...' : 'Delete' }}</button>
            </div>
        </div>

    </div>
</template>