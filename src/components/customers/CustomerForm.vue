<script setup>
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { customerTypes } from '../../constants/customerTypes.js'

import FormLabel from '../FormLabel.vue'
import BaseSelect from '../BaseSelect.vue'
import BaseTextInput from '../base/BaseTextInput.vue'
import BaseButton from '../base/BaseButton.vue'
import BaseFormContainer from '../base/BaseFormContainer.vue'

const props = defineProps({

    initialValues: {
        type: Object,
        default: () => ({
            name: '',
            email: '',
            creditLimit: null,
            customerType: '',
            acceptedTerms: false,
        })
    },

    submitLabel: {
        type: String,
        default: 'Save Customer',
    },

    validationSchema: {
        type: Object,
        required: true,
    },    

    loading: {
        type: Boolean,
        default: false,
    },

    showTerms: {
        type: Boolean,
        default: false,
    },
})

const emit = defineEmits(['submit', 'cancel'])

const {
    defineField,
    errors,
    handleSubmit,
    resetForm,
} = useForm({
    validationSchema: toTypedSchema(props.validationSchema),
    initialValues: props.initialValues,
})

const onSubmit = handleSubmit((values) => {
  emit('submit', values)
})

const fields = {
    name: defineField('name')[0],
    email: defineField('email')[0],
    creditLimit: defineField('creditLimit')[0],
    customerType: defineField('customerType')[0],
    acceptedTerms: defineField('acceptedTerms')[0],
}

</script>

<template>
   <BaseFormContainer>
       <form @submit.prevent="onSubmit">
            <div class="form-row">

                <div class="form-group">
                    <BaseTextInput
                        name="name"
                        id="name"
                        label="Customer Name"
                        :class="{ 'is-invalid': errors.name }"
                        v-model="fields.name.value"
                        placeholder="Enter customer name"
                    />
                    <p v-if="errors.name" class="invalid">{{ errors.name }}</p>
                </div>

                <div class="form-group">
                    <BaseTextInput  
                        :class="{ 'is-invalid': errors.email }"
                        v-model="fields.email.value"
                        label="Customer Email"
                        name="email"
                        id="email"
                        placeholder="Enter customer email"
                        type="email"
                    />
                    <p v-if="errors.email" class="invalid">{{ errors.email }}</p>
                </div>    

            </div>

            <div class="form-row">

                <div class="form-group">
                    <BaseTextInput
                        :class="{ 'is-invalid': errors.creditLimit }"
                        v-model.number="fields.creditLimit.value"
                        label="Credit Limit"
                        name="creditLimit"
                        id="creditLimit"
                        placeholder="Enter credit limit"
                        type="number"
                    />
                    <p v-if="errors.creditLimit" class="invalid">{{ errors.creditLimit }}</p>
                </div>

                <div class="form-group">
                    <BaseSelect
                        name="customerType"
                        id="customerType"
                        label="Customer Type"
                        :class="{ 'is-invalid': errors.customerType }"
                        v-model="fields.customerType.value"
                        :options="customerTypes"
                        all-options-selected-text="-- Select a customer type --"
                    />
                    <p v-if="errors.customerType" class="invalid">{{ errors.customerType }}</p>
                </div>  

            </div>

            <div class="form-group" v-if="props.showTerms">
                
                <input :class="{ 'is-invalid': errors.acceptedTerms }" type="checkbox" v-model="fields.acceptedTerms.value" name="acceptedTerms" id="acceptedTerms" />
                <FormLabel label="Accept Terms and Conditions" for="acceptedTerms" required inline />
                <p v-if="errors.acceptedTerms" class="invalid">{{ errors.acceptedTerms }}</p>
            </div>

            <div class="form-actions">

                <BaseButton 
                    label="Cancel" 
                    :loading="props.loading" 
                    variant="secondary"  
                    @click="$emit('cancel')"
                />

                <BaseButton 
                    :label="props.submitLabel" 
                    :loading="props.loading"  
                    :disabled="props.loading"
                    variant="primary" 
                    type="submit"
                />

            </div>

        </form> 
    </BaseFormContainer>
</template>