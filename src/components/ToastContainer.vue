<script setup>
import { useToast } from '../composables/useToast'
import Toast from './Toast.vue'

const { toasts } = useToast()
</script>

<template>

    <div class="toast-container">
        <Toast 
            v-for="toast in toasts" 
            :key="toast.id" 
            :toast="toast" 
        />
    </div>
    
</template>