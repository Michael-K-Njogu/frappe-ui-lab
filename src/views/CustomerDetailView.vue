<script setup>
import { useRoute } from 'vue-router'
import { useCustomer } from '../composables/useCustomer'
import PageTitle from '../components/PageTitle.vue'
import { ArrowLeft, Pencil } from '@lucide/vue'
import CustomerCard from '../components/customers/CustomerCard.vue'

const route = useRoute()
const { 
    customer, 
    loading, 
    error, 
    reload 
} = useCustomer(route.params.id)

</script>

<template>
    <RouterLink :to="{ name: 'customers' }" class="back-link">
        <ArrowLeft size="16" /> 
        Back to Customers
    </RouterLink>
    <PageTitle 
        title="Customer Details" 
        action-title="Edit Customer"
        action-type="secondary"
        :action-icon="Pencil"
        :to="{
            name: 'customer-edit', 
            params: { 
                id: route.params.id 
            }
        }"
    />
    <p v-if="loading">Loading customer details...</p>
    <p v-else-if="error">
        {{ error }}
    </p>
    <CustomerCard
        v-else-if="customer"
        :customer="customer"
    />
    <div v-else>
        <p>Customer not found.</p>
    </div>
</template>

