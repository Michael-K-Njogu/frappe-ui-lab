<script setup>
import BaseButton from './BaseButton.vue'

defineProps({
    modelValue: {
        type: Boolean,
        default: false
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
        default: 'Confirm'
    },

    cancelText: {
        type: String,
        default: 'Cancel'
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

const emit = defineEmits([
    'update:modelValue',
    'closed',
    'confirm',
    'cancel'
])

function closeModal() {
    emit('update:modelValue', false)
    emit('closed')
}

function confirm() {
    emit('confirm')
    closeModal()
}
</script>

<template>
    <Teleport to="body">
        <div 
            v-if="modelValue"
            class="modal-backdrop"
            @click.self="closeModal"
        >
            <div 
                class="modal"
                role="dialog"
                aria-modal="true"
            >

                <div class="modal-header">

                    <slot name="icon" />

                    <h3>{{ title }}</h3>

                </div>

                <div class="modal-body">

                    <slot name="body">
                        <p>{{ message }}</p>
                    </slot>

                </div>

                <div class="modal-footer">

                    <BaseButton
                        :label="cancelText"
                        variant="secondary"
                        @click="closeModal"
                    >
                    </BaseButton>

                    <BaseButton
                        :label="confirmText"
                        :variant="confirmVariant"
                        :loading="loading"
                        @click="confirm"
                    >
                        {{ confirmText }}
                    </BaseButton>

                </div>

            </div>
        </div>
    </Teleport>
</template>