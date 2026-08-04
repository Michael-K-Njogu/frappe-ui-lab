<script setup>
import { Search } from '@lucide/vue'

defineProps({
    modelValue: {
        type: String,
        default: ''
    },
    placeholder: {
        type: String,
        default: 'Search...'
    }
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
    <div class="search-input-container">
        <Search size="20" class="search-icon" />
    <input
        type="search"
        class="search-input"
        name="search"
        :value="modelValue"
        :placeholder="placeholder"
        @input="emit('update:modelValue', $event.target.value)"
    />
    </div>
</template>