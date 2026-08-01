<script setup>
import { watch } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { customerTypes } from '../../config/customerTypes'
import FormLabel from '../FormLabel.vue'
import BaseSelect from '../BaseSelect.vue'

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
        default: 'Save',
    },

    loading: {
        type: Boolean,
        default: false,
    },
    showTerms: {
        type: Boolean,
        default: false,
    },
    validationSchema: {
        type: Object,
        required: true,
    },
})

const emit = defineEmits(['submit'])

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
   <form class="form-container" @submit.prevent="onSubmit">
        <div class="form-row">

            <div class="form-group">
                <FormLabel label="Name" for="name" required />
                <input :class="{ 'is-invalid': errors.name }" v-model="fields.name.value" name="name" id="name" autocomplete="name" placeholder="Enter name" />
                <p v-if="errors.name" class="invalid">{{ errors.name }}</p>
            </div>

            <div class="form-group">
                <FormLabel label="Email" for="email" required />
                <input :class="{ 'is-invalid': errors.email }" v-model="fields.email.value" name="email" id="email" autocomplete="email" placeholder="Enter email" />
                <p v-if="errors.email" class="invalid">{{ errors.email }}</p>
            </div>    

        </div>

        <div class="form-row">

            <div class="form-group">
                <FormLabel label="Credit Limit" for="creditLimit" required />
                <input :class="{ 'is-invalid': errors.creditLimit }" v-model.number="fields.creditLimit.value" name="creditLimit" id="creditLimit" type="number" placeholder="Enter credit limit" />
                <p v-if="errors.creditLimit" class="invalid">{{ errors.creditLimit }}</p>
            </div>

            <div class="form-group">
                <FormLabel label="Customer Type" for="customerType" required />
                <BaseSelect
                    :class="{ 'is-invalid': errors.customerType }"
                    v-model="fields.customerType.value"
                    :options="customerTypes"
                    all-options-selected-text="All Customer Types"
                />
                <p v-if="errors.customerType" class="invalid">{{ errors.customerType }}</p>
            </div>  

        </div>

        <div class="form-group" v-if="props.showTerms">
            
            <input :class="{ 'is-invalid': errors.acceptedTerms }" type="checkbox" v-model="fields.acceptedTerms.value" name="acceptedTerms" id="acceptedTerms" />
            <FormLabel label="Accept Terms and Conditions" for="acceptedTerms" required inline />
            <p v-if="errors.acceptedTerms" class="invalid">{{ errors.acceptedTerms }}</p>
        </div>

        <div class="form-group">
            <button class="btn btn-primary" type="submit" :disabled="props.loading">{{ props.submitLabel }}</button>
        </div>
    </form>
</template>