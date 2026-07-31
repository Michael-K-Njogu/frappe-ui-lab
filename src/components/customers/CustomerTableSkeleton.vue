<script setup>
import BaseSkeleton from '../base/BaseSkeleton.vue'
</script>

<template>
    <div class="customer-table-skeleton">

        <div class="table-header">
            <BaseSkeleton width="100%" height="20px" />
            <BaseSkeleton width="100%" height="20px" />
            <BaseSkeleton width="100%" height="20px" />
            <BaseSkeleton width="100%" height="20px" />
            <BaseSkeleton width="100%" height="20px" />
        </div>

        <div 
            v-for="row in 5"
            :key="row"
            class="table-row"
        >
            <BaseSkeleton width="100%" height="20px"/>
            <BaseSkeleton width="100%" height="20px"/>
            <BaseSkeleton width="100%" height="20px"/>
            <BaseSkeleton width="100%" height="20px"/>
            <BaseSkeleton width="100%" height="20px"/>
        </div>

    </div>
</template>