// src/constants/orderStatus.js

export const ORDER_STATUS = {
  PENDING: 'Pending',
  COMPLETED: 'Completed',
  PROCESSING: 'Processing',
  DRAFT: 'Draft',
  CANCELED: 'Canceled'
}

export const ORDER_STATUS_VALUES = Object.values(
  ORDER_STATUS
)

export const ORDER_STATUS_OPTIONS =
  ORDER_STATUS_VALUES.map(status => ({
    label: status,
    value: status,
  }))

  export const ORDER_STATUS_TIMESTAMP_FIELD = {
    [ORDER_STATUS.PENDING]: 'postedAt',
    [ORDER_STATUS.PROCESSING]: 'processingStartedAt',
    [ORDER_STATUS.COMPLETED]: 'completedAt',
    [ORDER_STATUS.CANCELED]: 'canceledAt',
  }