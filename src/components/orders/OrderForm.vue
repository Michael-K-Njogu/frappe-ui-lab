<script setup>
import { watch, ref, computed } from 'vue'

import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'

import { calculateLineTotal } from '../../business/orderItemCalculations.js'
import {
  calculateProjectedBalance,
  calculateProjectedAvailableCredit,
} from '../../business/customerAccountCalculations.js'
import { formatCurrency } from '../../utils/formatters.js'

import BaseFormSection from '../base/BaseFormSection.vue'
import BaseFormLabel from '../base/BaseFormLabel.vue'
import Alert from '../Alert.vue'
import BaseSelect from '../base/BaseSelect.vue'
import BaseSearchableSelect from '../base/BaseSearchableSelect.vue'
import BaseTextInput from '../base/BaseTextInput.vue'
import BaseButton from '../base/BaseButton.vue'
import BaseTextArea from '../base/BaseTextArea.vue'
import OrderItemTable from '../order-items/OrderItemTable.vue'
import AddOrderItemModal from '../order-items/AddOrderItemModal.vue'
import BaseConfirmationModal from '../base/BaseConfirmationModal.vue'
import { Info, Plus, Trash2 } from '@lucide/vue'

const props = defineProps({
  initialValues: {
    type: Object,
    default: () => ({
      customerId: '',
      notes: '',
    }),
  },

  initialOrderItems: {
    type: Array,
    default: () => [],
  },

  customerOptions: {
    type: Array,
    default: () => [],
  },

  loading: {
    type: Boolean,
    default: false,
  },

  submitLabel: {
    type: String,
    default: 'Submit Order',
  },

  validationSchema: {
    type: Object,
    required: true,
  },

  customerAccount: {
    type: Object,
    default: null,
  },

  loadingCustomerAccount: {
    type: Boolean,
    default: false,
  },

  editable: {
    type: Boolean,
    default: false,
  },
})

const showAddItemModal = ref(false)
const editingOrderItem = ref(null)
const showDeleteItemModal = ref(false)
const itemToDelete = ref(null)
const orderItems = ref([...props.initialOrderItems])
const showClearItemsModal = ref(false)

const orderGrandTotal = computed(() => {
  return orderItems.value.reduce((total, item) => total + Number(item.lineTotal || 0), 0)
})

const projectedBalance = computed(() => {
  if (!props.customerAccount) {
    return 0
  }

  return calculateProjectedBalance(props.customerAccount.currentBalance, orderGrandTotal.value)
})

const projectedAvailableCredit = computed(() => {
  if (!props.customerAccount) {
    return 0
  }

  return calculateProjectedAvailableCredit(
    props.customerAccount.creditLimit,
    props.customerAccount.currentBalance,
    orderGrandTotal.value,
  )
})

const emit = defineEmits([
  'post-order',
  'save-draft',
  'delete-order',
  'customer-change',
  'clear-items',
])

const {
  defineField,
  errors,
  loading: saving,
  handleSubmit,
  resetForm,
} = useForm({
  validationSchema: toTypedSchema(props.validationSchema),
  initialValues: props.initialValues,
})

const saveDraft = handleSubmit((values) => {
  emit('save-draft', {
    ...values,
    orderItems: [...orderItems.value],
  })
})

const postOrder = handleSubmit((values) => {
  if (!orderItems.value.length) {
    return
  }

  emit('post-order', {
    ...values,
    orderItems: [...orderItems.value],
  })
})

const fields = {
  customerId: defineField('customerId')[0],
  notes: defineField('notes')[0],
}

function handleEditOrderItem(item) {
  editingOrderItem.value = item
  showAddItemModal.value = true
}

function handleDeleteOrderItem(item) {
  itemToDelete.value = item
  showDeleteItemModal.value = true
}

function closeOrderItemModal() {
  showAddItemModal.value = false
  editingOrderItem.value = null
}

function confirmDeleteOrderItem() {
  if (!itemToDelete.value) return

  const item = itemToDelete.value

  orderItems.value = orderItems.value.filter((currentItem) => currentItem.id !== item.id)

  itemToDelete.value = null
  showDeleteItemModal.value = false

  emit('delete-item', item)
}

function handleClearAllItems() {
  if (!orderItems.value.length) return

  showClearItemsModal.value = true
}

function confirmClearAllItems() {
  orderItems.value = []

  showClearItemsModal.value = false

  emit('clear-items')
}

watch(
  () => props.initialValues,
  (values) => {
    resetForm({
      values,
    })
  },
  { deep: true },
)

watch(
  () => fields.customerId.value,
  (customerId) => {
    emit('customer-change', customerId)
  },
)

watch(
  () => props.initialOrderItems,
  (items) => {
    orderItems.value = [...items]
  },
  { deep: true },
)

function handleOrderItemSubmit(values) {
  // Editing an existing order item
  if (editingOrderItem.value) {
    const index = orderItems.value.findIndex((item) => item.id === editingOrderItem.value.id)

    if (index !== -1) {
      orderItems.value[index] = {
        ...orderItems.value[index],
        ...values,
      }
    }
  } else {
    // Adding a new item
    const existingItem = orderItems.value.find((item) => item.productId === values.productId)

    if (existingItem) {
      const mergedQuantity = Number(existingItem.quantity) + Number(values.quantity)

      const mergedDiscount = Number(existingItem.discount || 0) + Number(values.discount || 0)

      existingItem.quantity = mergedQuantity
      existingItem.discount = mergedDiscount

      existingItem.lineTotal = calculateLineTotal({
        quantity: mergedQuantity,
        unitPrice: existingItem.unitPrice,
        discount: mergedDiscount,
      })
    } else {
      orderItems.value.push({
        id: crypto.randomUUID(),
        ...values,
        isTemporary: true,
      })
    }
  }

  closeOrderItemModal()
}
</script>

<template>
  <form class="form-container" @submit.prevent>
    <div class="form-row">
      <!-- Customer select - will be updated to searchable dropdown to enhance user experience -->
      <div class="form-group">
        <BaseSearchableSelect
          v-model="fields.customerId.value"
          label="Customer"
          :options="customerOptions"
          :error="errors.customerId"
          placeholder="Search customers..."
          all-options-selected-text="Select a customer"
        />
        <p v-if="errors.customerId" class="invalid">{{ errors.customerId }}</p>

        <div v-if="loadingCustomerAccount" class="customer-account-summary">
          <span>Loading account information...</span>
        </div>

        <div v-else-if="customerAccount" class="customer-account-summary">
          <div class="account-summary-item">
            <span class="account-summary-label"> Credit Limit </span>

            <span class="account-summary-value">
              {{ formatCurrency(customerAccount.creditLimit) }}
            </span>
          </div>

          <div class="account-summary-item">
            <span class="account-summary-label"> Current Balance </span>

            <span class="account-summary-value">
              {{ formatCurrency(customerAccount.currentBalance) }}
            </span>
          </div>

          <div class="account-summary-item">
            <span class="account-summary-label">
              {{ orderGrandTotal > 0 ? 'Available Credit After Order' : 'Available Credit' }}
            </span>

            <span
              class="account-summary-value"
              :class="{
                'is-negative': customerAccount.availableCredit < 0,
              }"
            >
              {{
                formatCurrency(
                  orderGrandTotal > 0 ? projectedAvailableCredit : customerAccount.availableCredit,
                )
              }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="orderItems.length" class="card-header">
      <h3>Order Items</h3>

      <div class="order-items-header-actions">
        <BaseButton
          v-if="editable"
          label="Clear All"
          variant="danger"
          size="sm"
          @click="handleClearAllItems"
        >
          <template #icon>
            <Trash2 size="16" />
          </template>
        </BaseButton>

        <BaseButton
          id="add-order-item"
          name="add-order-item"
          label="Add Item"
          size="sm"
          @click="showAddItemModal = true"
        >
          <template #icon>
            <Plus size="16" />
          </template>
        </BaseButton>
      </div>
    </div>

    <OrderItemTable
      :items="orderItems"
      :loading="false"
      :editable="editable"
      @edit="handleEditOrderItem"
      @delete="handleDeleteOrderItem"
    >
      <template #actions>
        <BaseButton label="Add First Item" type="button" @click="showAddItemModal = true" />
      </template>
    </OrderItemTable>

    <div class="form-group">
      <BaseTextArea
        name="notes"
        id="notes"
        :required="false"
        label="Order Notes"
        v-model="fields.notes.value"
        :error="errors.notes"
        placeholder="Enter any notes for the order (optional)"
      />
      <p v-if="errors.notes" class="invalid">{{ errors.notes }}</p>
    </div>

    <div class="form-actions">
      <BaseButton
        :label="orderItems.length > 0 ? 'Save Draft' : 'Save Draft (No Items)'"
        :loading="loading"
        variant="secondary"
        type="button"
        @click="saveDraft"
      />

      <BaseButton
        :label="submitLabel"
        :loading="loading"
        :disabled="orderItems.length === 0"
        variant="primary"
        type="button"
        @click="postOrder"
      />
    </div>
  </form>

  <AddOrderItemModal
    :open="showAddItemModal"
    :loading="false"
    :mode="editingOrderItem ? 'edit' : 'new'"
    :initial-values="editingOrderItem"
    @close="closeOrderItemModal"
    @submit="handleOrderItemSubmit"
  />

  <BaseConfirmationModal
    v-if="itemToDelete"
    v-model="showDeleteItemModal"
    title="Delete Order Item"
    :message="`Are you sure you want to remove ${itemToDelete.productName} from this order?`"
    confirm-text="Delete Item"
    cancel-text="Keep Item"
    @confirm="confirmDeleteOrderItem"
  />

  <BaseConfirmationModal
    v-model="showClearItemsModal"
    title="Clear All Order Items"
    message="Are you sure you want to remove all items from this order? This action cannot be undone."
    confirm-text="Clear All"
    cancel-text="Keep Items"
    @confirm="confirmClearAllItems"
  />
</template>
