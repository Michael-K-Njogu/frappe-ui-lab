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
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
    <select
        class="base-select"
        name="base-select"
        :value="modelValue"
        @change="emit('update:modelValue', $event.target.value)"
    >
        <option value="">All Types</option>
        <option
            v-for="option in options"
            :key="option.value"
            :value="option.value"
        >
            {{ option.label }}
        </option>
    </select>
</template>