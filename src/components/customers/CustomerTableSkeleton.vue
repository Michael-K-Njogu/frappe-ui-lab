<script setup>
import BaseSkeleton from '../base/BaseSkeleton.vue'

const { rows } = defineProps({
    rows: {
        type: Number,
        default: 5
    }
})

const columns = 5 // Assuming there are 5 columns in the customer table
</script>

<template>
    <div class="customer-table-skeleton">

        <div class="customer-table-skeleton__header">
            <BaseSkeleton 
                v-for="col in columns"
                :key="col"
                width="100%" 
                height="20px" 
            />
        </div>

        <div 
            v-for="row in rows"
            :key="row"
            class="customer-table-skeleton__row"
        >
            <BaseSkeleton 
                v-for="col in columns"
                :key="col"
                width="100%" 
                height="20px"
            />
        </div>

    </div>
</template>