<script setup>
import FormLabel from '../FormLabel.vue'

defineProps({
    modelValue: {
        type: [String, Number],
        default: ''
    },
    placeholder: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        default: 'text'
    },
    label: {
        type: String,
        default: 'Form Label',
    },
    required: {
        type: Boolean,
        default: true,
    },    
    name: {
        type: String,
        default: 'base-text-input',
    },
    id: {
        type: String,
        default: 'base-text-input',
    },
    autocomplete: {
        type: String,
        default: 'off',
    },
    error: {
        type: String,
        default: '',
    },
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
    <div class="base-text-input-wrapper">
        <FormLabel :label="label" :for="id" :required="required" />
        <input
            :type="type"
            :name="name"
            :id="id"
            :placeholder="placeholder"
            :value="modelValue"
            :autocomplete="autocomplete"
            @input="emit('update:modelValue', $event.target.value)"
        />
    </div>
</template>