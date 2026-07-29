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
})

const emit = defineEmits(['confirm', 'cancel'])
</script>

<template>
    <div class="modal-backdrop">

        <div class="modal">
            <h2>{{ title }}</h2>
            <p>{{ message }}</p>

            <div class="modal-actions">
                <button class="btn btn-secondary" @click="emit('cancel')">Cancel</button>                
                <button class="btn btn-primary" @click="emit('confirm')">Confirm</button>
            </div>
        </div>

    </div>
</template>