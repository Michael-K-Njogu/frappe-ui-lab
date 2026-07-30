<script setup>
import { computed, watchEffect } from 'vue'

const totalPages = computed(() => {
    return Math.max(
        1,
        Math.ceil(props.totalItems / props.pageSize)
    )
})

const startItem = computed(() => {
    if(props.totalItems === 0) {
        return 0
    }

    return (props.currentPage - 1) * props.pageSize + 1
})

const endItem = computed(() => {
    return Math.min(
        props.currentPage * props.pageSize,
        props.totalItems
    )
})

const hasPrevious = computed(() => {
    return props.currentPage > 1
})

const hasNext = computed(() => {
    return props.currentPage < totalPages.value
})

const props = defineProps({
    currentPage: {
        type: Number,
        required: true
    },

    pageSize: {
        type: Number,
        required: true
    },

    totalItems: {
        type: Number,
        required: true
    }
})

const emit = defineEmits([
    'update:currentPage', 
    'update:pageSize'
])

function goToPreviousPage() {
    if(hasPrevious.value) {
        emit('update:currentPage', props.currentPage - 1)
    }
}

function goToNextPage() {
    if(hasNext.value) {
        emit('update:currentPage', props.currentPage + 1)
    }
}
</script>

<template>
    <div class="pagination">
        <span class="pagination-summary">Showing {{ startItem }} to {{ endItem }} of {{ totalItems }} entries</span>

        <div class="pagination-controls">
            <button 
                class="btn btn-md btn-secondary"
                :disabled="!hasPrevious"
                @click="goToPreviousPage"
            >
                Previous
            </button>

            <span class="pagination-page-info">
                Page {{ currentPage }} of {{ totalPages }}
            </span>

            <button 
                class="btn btn-md btn-secondary"
                :disabled="!hasNext"
                @click="goToNextPage"
            >
                Next
            </button>
        </div>
    </div>
</template>