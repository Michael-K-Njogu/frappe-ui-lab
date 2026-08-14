<script setup>
import BaseFormLabel from './BaseFormLabel.vue'

const props = defineProps({
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

function handleInput(event) {
    let value = event.target.value

    if (props.type === 'number') {
        value = event.target.value === ''
            ? null
            : event.target.valueAsNumber
    }

    emit('update:modelValue', value)
}
</script>

<template>
    <div class="base-text-input-wrapper">
        <BaseFormLabel :label="label" :for="id" :required="required" />
        <input
            :type="type"
            :name="name"
            :id="id"
            :placeholder="placeholder"
            :value="modelValue"
            :autocomplete="autocomplete"
            @input="handleInput"
        />
    </div>
</template>