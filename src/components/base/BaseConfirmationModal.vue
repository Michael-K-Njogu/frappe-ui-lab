<script setup>
import BaseButton from './BaseButton.vue'

defineProps({
    open: {
        type: Boolean,
        required: true
    },

    title: {
        type: String,
        required: true
    },

    message: {
        type: String,
        required: true
    },

    confirmText: {
        type: String,
        default: 'Delete'
    },

    confirmVariant: {
        type: String,
        default: 'danger'
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
                <BaseButton 
                    label="Cancel"
                    variant="secondary" 
                    :disabled="loading" 
                    @click="emit('cancel')"
                />
                <BaseButton 
                    :label="loading ? 'Deleting...' : confirmText"
                    :variant="confirmVariant" 
                    :disabled="loading" 
                    @click="emit('confirm')"
                />
            </div>
        </div>

    </div>
</template>