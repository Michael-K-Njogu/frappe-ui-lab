<script setup>
import { watch } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { customerTypes } from '../../config/customerTypes'
import FormLabel from '../FormLabel.vue'

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
   <form @submit.prevent="onSubmit">
        <div class="form-group">
            <FormLabel label="Name" for="name" required />
            <input v-model="fields.name.value" name="name" id="name" autocomplete="name" placeholder="Enter name" />
            <p v-if="errors.name" class="invalid">{{ errors.name }}</p>
        </div>

        <div class="form-group">
            <FormLabel label="Email" for="email" required />
            <input v-model="fields.email.value" name="email" id="email" autocomplete="email" placeholder="Enter email" />
            <p v-if="errors.email" class="invalid">{{ errors.email }}</p>
        </div>

        <div class="form-group">
            <FormLabel label="Credit Limit" for="creditLimit" required />
            <input v-model.number="fields.creditLimit.value" name="creditLimit" id="creditLimit" type="number" placeholder="Enter credit limit" />
            <p v-if="errors.creditLimit" class="invalid">{{ errors.creditLimit }}</p>
        </div>

        <div class="form-group">
            <FormLabel label="Customer Type" for="customerType" required />
            <select v-model="fields.customerType.value" name="customerType" id="customerType">
                <option value="">Select type</option>
                <option v-for="type in customerTypes" :key="type.value" :value="type.value">{{ type.label }}</option>
            </select>
            <p v-if="errors.customerType" class="invalid">{{ errors.customerType }}</p>
        </div>

        <div class="form-group" v-if="props.showTerms">
            <FormLabel label="Accept Terms and Conditions" for="acceptedTerms" required />
            <input type="checkbox" v-model="fields.acceptedTerms.value" name="acceptedTerms" id="acceptedTerms" />
            <p v-if="errors.acceptedTerms" class="invalid">{{ errors.acceptedTerms }}</p>
        </div>

        <div class="form-group">
            <button class="btn btn-primary" type="submit" :disabled="props.loading">{{ props.submitLabel }}</button>
        </div>
    </form>
</template>