<script setup>
defineProps({
    modelValue: {
        type: String,
        default: ''
    },
    options: {
        type: Array,
        default: () => []
    },
    allOptionsSelectedText: {
        type: String,
        default: 'All Options'
    }
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
    <div class="base-select-wrapper">
        <select
            class="base-select"
            name="base-select"
            :value="modelValue"
            @change="emit('update:modelValue', $event.target.value)"
        >
        <option value="">{{ allOptionsSelectedText }}</option>
        <option
            v-for="option in options"
            :key="option.value"
            :value="option.value"
        >
            {{ option.label }}
        </option>
        </select>
    </div>
</template>