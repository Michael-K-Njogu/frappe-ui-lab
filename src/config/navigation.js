import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Settings,
} from '@lucide/vue'

export const navigation = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    to: '/',
  },
  {
    title: 'Customers',
    icon: Users,
    to: '/customers',
  },
  {
    title: 'Orders',
    icon: ShoppingCart,
    to: '/orders',
  },
]