<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from '../composables/useToast'
import { getOrderById } from '../services/orderService'
import PageTitle from '../components/PageTitle.vue'
import OrderForm from '../components/orders/OrderForm.vue'
import { updateOrder } from '../services/orderService'
import { useOrder } from '../composables/useOrder'
import { getCustomers } from '../services/customerService'
import { updateOrderSchema } from '../validation/orderSchema.js'

const route = useRoute()
const router = useRouter()
const { toasts } = useToast()
const customerOptions = ref([])
const order = ref(null)
const loading = ref(true)
const saving = ref(false)

const {
    success,
    error: showError,
} = useToast()

async function loadCustomerOptions() {
    const { data } = await getCustomers({
        page: 1,
        pageSize: 1000,
    })

    customerOptions.value = data.map(customer => ({
        value: customer.id,
        label: customer.name,
    }))
}

async function loadOrder() {
    loading.value = true

    try {
        order.value = await getOrderById(route.params.id)
    } catch (err) {
        console.error(err)
    } finally {
        loading.value = false
    }
}

async function saveOrder(values) {
    saving.value = true

    try {
        await updateOrder(
            order.value.id, 
            values
        )

        success(`Order ${order.value.orderNumber} updated successfully.`)

        router.push({ 
            name: 'order-details', 
            params: { 
                id: route.params.id 
            } 
        })

    } catch (err) {
        console.error(err)
        showError(err.message || 'An error occurred while updating the order.')
    } finally {
        saving.value = false
    }
}

onMounted(async () => {
    loading.value = true

    try {
        await Promise.all([
            loadCustomerOptions(), 
            loadOrder()
        ])
    } catch (err) {
        console.error(err)
    } finally {
        loading.value = false
    }
})
</script>

<template>
    <PageTitle title="Edit Order" :has-back-button="true" />

    <div v-if="loading">
        <p>Loading order...</p>
    </div>

    <OrderForm
    v-if="order"
    :initial-values="order"
    :customer-options="customerOptions"
    :validation-schema="updateOrderSchema"
    submit-label="Update Order"
    :loading="saving"
    @submit="saveOrder"
    @cancel="router.back()"
    />
</template>