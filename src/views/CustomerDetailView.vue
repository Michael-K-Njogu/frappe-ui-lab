<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCustomer } from '../composables/useCustomer'
import { deleteCustomer } from '../services/customerService'
import PageTitle from '../components/PageTitle.vue'
import { ArrowLeft, Pencil, Trash2 } from '@lucide/vue'
import CustomerCard from '../components/customers/CustomerCard.vue'
import ConfirmationModal from '../components/modals/ConfirmationModal.vue'

const showDeleteModal = ref(false)
const route = useRoute()
const router = useRouter()
const deleting = ref(false)

async function handleDelete() {

    deleting.value = true

    try {
        await deleteCustomer(route.params.id)

        router.push({
            name: 'customers',
        })
    } finally {
        deleting.value = false
    }
    showDeleteModal.value = false
}

const { 
    customer, 
    loading, 
    error, 
} = useCustomer(route.params.id)

</script>

<template>
    <RouterLink :to="{ name: 'customers' }" class="back-link">
        <ArrowLeft size="16" /> 
        Back to Customers
    </RouterLink>
    <PageTitle title="Customer Details">
        <template #actions>

            <RouterLink 
                v-if="customer" 
                :to="{ name: 'customer-edit', params: { id: customer.id } }" 
                class="btn btn-primary"
            >
                <Pencil size="16" />
                Edit Customer
            </RouterLink>

            <button 
                v-if="customer" 
                class="btn btn-danger" 
                @click="showDeleteModal = true"
            >
                <Trash2 size="16" />
                Delete Customer
            </button>
        </template>
    </PageTitle>
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

    <ConfirmationModal
        v-if="showDeleteModal"
        title="Confirm Deletion"
        :message="`Are you sure you want to delete ${customer.name} from the database? This action cannot be undone.`"
        :loading="deleting"
        @confirm="handleDelete"
        @cancel="showDeleteModal = false"
    />
</template>

<style scoped>
</style>

