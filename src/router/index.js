import { createRouter, createWebHistory } from 'vue-router'

import AppLayout from '../layouts/AppLayout.vue'

// Dashboard
import DashboardView from '../views/DashboardView.vue'

// Customers
import CustomersView from '../views/CustomersView.vue'
import CustomerDetailView from '../views/CustomerDetailView.vue'
import NewCustomerView from '../views/NewCustomerView.vue'
import EditCustomerView from '../views/EditCustomerView.vue'

// Orders
import OrdersView from '../views/OrdersView.vue'
import OrderDetailView from '../views/OrderDetailView.vue'
import NewOrderView from '../views/NewOrderView.vue'
import EditOrderView from '../views/EditOrderView.vue'

// Products
import ProductsView from '../views/ProductsView.vue'
import ProductDetailView from '../views/ProductDetailView.vue'
import NewProductView from '../views/NewProductView.vue'

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
        {
          path: 'orders',
          name: 'orders',
          component: OrdersView,
        },
        {
          path: 'orders/:id',
          name: 'order-details',
          component: () => import('../views/OrderDetailView.vue'),
        },
        {
          path: 'orders/new',
          name: 'order-new',
          component: () => import('../views/NewOrderView.vue'),
        },
        {
          path: 'orders/:id/edit',
          name: 'order-edit',
          component: () => import('../views/EditOrderView.vue'),
        },
        {
          path: 'products',
          name: 'products',
          component: () => import('../views/ProductsView.vue'),
        },
        {
          path: 'products/:id',
          name: 'product-details',
          component: () => import('../views/ProductDetailView.vue'),
        },
        {
          path: 'products/new',
          name: 'product-new',
          component: () => import('../views/NewProductView.vue'),
        },
      ],
    },
  ],
})

export default router