<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCustomer } from '../composables/useCustomer'
import { useToast } from '../composables/useToast'
import PageTitle from '../components/PageTitle.vue'
import { ArrowLeft, Pencil, Trash2 } from '@lucide/vue'
import CustomerCard from '../components/customers/CustomerCard.vue'
import BaseConfirmationModal from '../components/base/BaseConfirmationModal.vue'
import BaseSkeleton from '../components/base/BaseSkeleton.vue'

const showDeleteModal = ref(false)
const route = useRoute()
const router = useRouter()
const { info, error: showError } = useToast()

async function handleDelete() {
    try {
        await deleteCustomer()

        showDeleteModal.value = false

        info('The customer has been successfully deleted.', {
            title: 'Customer Deleted',
        })

        router.push({
            name: 'customers',
        })
    } catch (err) {
        showError(err.message) // Display the error message in a toast notification
    }
}

const { 
    customer, 
    loading, 
    error, 
    deleting,
    refresh,
    deleteCustomer,
} = useCustomer(route.params.id)

</script>

<template>
    <PageTitle title="Customer Details" :has-back-button="true">
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

    <BaseConfirmationModal
        v-if="showDeleteModal"
        title="Confirm Deletion"
        :message="`Are you sure you want to delete ${customer.name} from the database? This action cannot be undone.`"
        :loading="deleting"
        @confirm="handleDelete"
        @cancel="showDeleteModal = false"
    />
    
    <BaseSkeleton
        v-if="loading"
        width="100%"
        height="1rem"
    />
</template>

<style scoped>
</style>

