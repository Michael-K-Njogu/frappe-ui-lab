<script setup>
import { watch } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { ORDER_STATUS } from '../../constants/orderStatuses.js'
import FormLabel from '../FormLabel.vue'
import BaseSelect from '../BaseSelect.vue'
import BaseTextInput from '../base/BaseTextInput.vue'
import BaseButton from '../base/BaseButton.vue'
import BaseTextArea from '../base/BaseTextArea.vue'

const props = defineProps({
    initialValues: {
        type: Object,
        default: () => ({
            customerId: '',
            status: ORDER_STATUS.PENDING,
            totalAmount: null,
            notes: '',
        })
    },

    customerOptions: {
        type: Array,
        default: () => [],
    },

    loading: {
        type: Boolean,
        default: false,
    },
    
    submitLabel: {
        type: String,
        default: 'Save Order',
    },

    validationSchema: {
        type: Object,
        required: true,
    },
})

const emit = defineEmits([
  'post-order',
  'save-draft',
])

const {
    defineField,
    errors,
    loading: saving,    
    handleSubmit,
    resetForm,
} = useForm({
    validationSchema: toTypedSchema(props.validationSchema),
    initialValues: props.initialValues,
})

const saveDraft = handleSubmit((values) => {
  emit('save-draft', values)
})

const postOrder = handleSubmit((values) => {
  emit('post-order', values)
})

const fields = {
    customerId: defineField('customerId')[0],
    totalAmount: defineField('totalAmount')[0],
    notes: defineField('notes')[0],
}

watch(
  () => props.initialValues,
  (values) => {
    resetForm({
      values,
    })
  },
  { deep: true }
)
</script>

<template>
    <form class="form-container" @submit.prevent="onSubmit">

        <div class="form-row">

            <!-- Customer select - will be updated to searchable dropdown to enhance user experience -->
            <div class="form-group">
                <FormLabel for="customerId" label="Customer" required />
                <BaseSelect
                    :class="{ 'is-invalid': errors.customerId }"
                    all-options-selected-text="-- Select a customer --"
                    v-model="fields.customerId.value"
                    :options="customerOptions"
                    :error="errors.customerId"
                    placeholder="Select a customer"
                />
                <p v-if="errors.customerId" class="invalid">{{ errors.customerId }}</p>
            </div>

            <!-- Total amount field - will be omitted when Products module is completed -->
            <div class="form-group">
                <FormLabel for="totalAmount" label="Order Total" required />
                <BaseTextInput
                    :class="{ 'is-invalid': errors.totalAmount }"
                    v-model.number="fields.totalAmount.value"
                    :error="errors.totalAmount"
                    type="number"
                    placeholder="Enter total amount"
                />
                <p v-if="errors.totalAmount" class="invalid">{{ errors.totalAmount }}</p>
            </div>            

        </div>


        <div class="form-group">
            <FormLabel for="notes" label="Notes" />
                <BaseTextArea
                    v-model="fields.notes.value"
                    :error="errors.notes"
                    placeholder="Enter notes"
                />
            <p v-if="errors.notes" class="invalid">{{ errors.notes }}</p>
        </div>     

        <div class="form-actions">

            <BaseButton 
                :label="'Save Draft'" 
                :loading="loading" 
                variant="secondary" 
                size="lg" 
                @click="saveDraft" 
            />

            <BaseButton 
                :label="submitLabel" 
                :loading="loading"  
                variant="primary" 
                size="lg" 
                @click="postOrder"
                />
            </div>

    </form>
</template>