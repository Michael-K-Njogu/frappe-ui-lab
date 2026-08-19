import { CirclePlus, Send, Package, CheckCircle2, Ban } from '@lucide/vue'

export const ORDER_TIMELINE = [
  {
    key: 'createdAt',
    title: (order) => `Order ${order.orderNumber} created`,
    icon: CirclePlus,
    color: 'primary',
  },
  {
    key: 'postedAt',
    title: 'Order posted successfully',
    icon: Send,
    color: 'info',
  },
  {
    key: 'processingStartedAt',
    title: 'Order approved and processing started',
    icon: Package,
    color: 'warning',
  },
  {
    key: 'completedAt',
    title: 'Order completed successfully',
    icon: CheckCircle2,
    color: 'success',
  },
  {
    key: 'canceledAt',
    title: 'Order canceled by user',
    icon: Ban,
    color: 'danger',
  },
]
