// src/constants/orderStatus.js

export const ORDER_STATUS = {
  PENDING: 'Pending',
  COMPLETED: 'Completed',
  PROCESSING: 'Processing',
  DRAFT: 'Draft',
  CANCELED: 'Canceled'
}

export const ORDER_STATUS_OPTIONS = [
  {
    value: ORDER_STATUS.PENDING,
    label: ORDER_STATUS.PENDING,
  },
  {
    value: ORDER_STATUS.COMPLETED,
    label: ORDER_STATUS.COMPLETED,
  },
  {
    value: ORDER_STATUS.CANCELED,
    label: ORDER_STATUS.CANCELED,
  },
  {
    value: ORDER_STATUS.PROCESSING,
    label: ORDER_STATUS.PROCESSING,
  },
  {
    value: ORDER_STATUS.DRAFT,
    label: ORDER_STATUS.DRAFT,
  },
]