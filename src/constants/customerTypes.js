export const customerTypes = [
  {
    value: 'retail',
    label: 'Retail',
  },
  {
    value: 'wholesale',
    label: 'Wholesale',
  },
  {
    value: 'project',
    label: 'Project',
  },
]

export function getCustomerTypeLabel(value) {
  const type = customerTypes.find((type) => type.value === value)
  return type ? type.label : value
}