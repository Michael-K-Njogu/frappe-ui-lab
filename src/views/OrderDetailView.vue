<script setup>
import PageTitle from '../components/PageTitle.vue'
import { useRoute, useRouter } from 'vue-router'
import { useOrder } from '../composables/useOrder'
import OrderCard from '../components/orders/OrderCard.vue'
import BaseSkeleton from '../components/base/BaseSkeleton.vue'

const route = useRoute()
const router = useRouter()


const { 
    order, 
    loading, 
    error, 
    deleting, 
    deleteOrder 
} = useOrder(route.params.id)
</script>

<template>
    <PageTitle title="Order Details" :has-back-button="true" />
    <OrderCard
        v-if="order"
        :order="order"      
    />
</template>