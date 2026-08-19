import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Settings,
  Package,
  ChartNoAxesCombined,
  ReceiptText,
  CreditCard,
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
  {
    title: 'Products',
    icon: Package,
    to: '/products',
  },
  /*
  {
    title: 'Invoices',
    icon: ReceiptText,
    to: '/invoices',
  },
  {
    title: 'Payments',
    icon: CreditCard,
    to: '/payments',
  },
  {
    title: 'Reports',
    icon: ChartNoAxesCombined,
    to: '/reports',
  },
  {
    title: 'Settings',
    icon: Settings,
    to: '/settings',
  },
  */
]
