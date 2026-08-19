<script setup>
import InvoiceDocument from './InvoiceDocument.vue'
import BaseButton from '../base/BaseButton.vue'
import { X } from '@lucide/vue'

defineProps({
    open: {
        type: Boolean,
        default: false,
    },

    order: {
        type: Object,
        required: true,
    },

    items: {
        type: Array,
        default: () => [],
    },

    customer: {
        type: Object,
        default: null,
    },
})

const emit = defineEmits(['close'])
</script>

<template>
    <Teleport to="body">
        <Transition name="invoice-panel">
            <div
                v-if="open"
                class="invoice-preview-overlay"
                @click.self="$emit('close')"
            >
                <aside class="invoice-preview-panel">

                    <header class="invoice-preview-header">
                        <div>
                            <h3>Invoice Preview</h3>

                            <p>
                                {{ order.orderNumber }}
                            </p>
                        </div>

                        <BaseButton
                            type="button"
                            variant="secondary"
                            size="sm"
                            aria-label="Close invoice preview"
                            @click="$emit('close')"
                        >
                            <template #icon>
                                <X :size="18" />
                            </template>
                        </BaseButton>
                    </header>

                    <div class="invoice-preview-content">
                        <InvoiceDocument
                            :order="order"
                            :items="items"
                            :customer="customer"
                        />
                    </div>

                </aside>
            </div>
        </Transition>
    </Teleport>
</template>