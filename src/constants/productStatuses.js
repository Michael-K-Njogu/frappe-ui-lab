export const PRODUCT_STATUS = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
}

export const PRODUCT_STATUS_OPTIONS =
  Object.values(PRODUCT_STATUS).map(status => ({
    label: status,
    value: status,
  }))

export const PRODUCT_STATUS_VARIANTS = {
  Active: 'success',
  Inactive: 'danger',
}