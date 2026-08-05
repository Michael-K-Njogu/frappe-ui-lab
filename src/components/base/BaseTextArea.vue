<script setup>
import FormLabel from '../FormLabel.vue'

defineProps({
    modelValue: {
        type: String,
        default: ''
    },
    placeholder: {
        type: String,
        default: ''
    },
    label: {
        type: String,
        default: 'Form Label',
    },
    name: {
        type: String,
        default: 'base-text-area',
    },
    required: {
        type: Boolean,
        default: true,
    },    
    id: {
        type: String,
        default: 'base-text-area',
    },   
    rows: {
        type: Number,
        default: 4,
    }, 
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
    <div class="base-text-area-wrapper">
        <FormLabel :label="label" :for="id" :required="required" />
        <textarea
            :value="modelValue"
            :rows="rows"
            :name="name"
            :id="id"
            :placeholder="placeholder"
            @input="emit('update:modelValue', $event.target.value)"
        >
        </textarea>
    </div>
</template>