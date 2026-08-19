<script setup>
import { computed, watch } from 'vue'

import { createOrderItemSchema } from '../../validation/orderItemSchema.js'

import BaseModal from '../base/BaseModal.vue'
import OrderItemForm from './OrderItemForm.vue'

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },

  loading: {
    type: Boolean,
    default: false,
  },

  mode: {
    type: String,
    default: 'new',
  },

  initialValues: {
    type: Object,
    default: null,
  },
})

const isEditMode = computed(() => props.mode === 'edit')

const emit = defineEmits(['close', 'submit'])
</script>

<template>
  <BaseModal
    :open="open"
    :title="isEditMode ? 'Edit Order Item' : 'Add Product to Order'"
    :no-padding="true"
    :show-footer="false"
    @close="$emit('close')"
  >
    <template #body>
      <OrderItemForm
        :validation-schema="createOrderItemSchema"
        :loading="loading"
        :mode="mode"
        :initial-values="initialValues"
        :submit-label="isEditMode ? 'Save Changes' : 'Add Item'"
        @submit="$emit('submit', $event)"
        @cancel="$emit('close')"
      />
    </template>

    <template #footer>
      <slot />
    </template>
  </BaseModal>
</template>
