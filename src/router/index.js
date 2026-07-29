import { createRouter, createWebHistory } from 'vue-router'

import AppLayout from '../layouts/AppLayout.vue'
import DashboardView from '../views/DashboardView.vue'
import CustomersView from '../views/CustomersView.vue'
import OrdersView from '../views/OrdersView.vue'
import CustomerDetailView from '../views/CustomerDetailView.vue'
import NewCustomerView from '../views/NewCustomerView.vue'
import EditCustomerView from '../views/EditCustomerView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: AppLayout,

      children: [
        {
          path: '',
          name: 'dashboard',
          component: DashboardView,
        },
        {
          path: 'customers',
          name: 'customers',
          component: CustomersView,
        },
        {
          path: 'orders',
          name: 'orders',
          component: OrdersView,
        },
        {
          path: 'customers/:id',
          name: 'customer-details',
          component: () => import('../views/CustomerDetailView.vue'),
        },
        {
          path: 'customers/new',
          name: 'customer-new',
          component: NewCustomerView,
        },
        {
          path: 'customers/:id/edit',
          name: 'customer-edit',
          component: () => import('../views/EditCustomerView.vue'),
        },
      ],
    },
  ],
})

export default router