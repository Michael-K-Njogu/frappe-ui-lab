export const PRODUCT_CATEGORIES = [
  {
    label: 'Cement',
    value: 'cement',
  },
  {
    label: 'Steel',
    value: 'steel',
  },
  {
    label: 'Aggregates',
    value: 'aggregates',
  },
  {
    label: 'Paint',
    value: 'paint',
  },
]

export const PRODUCT_CATEGORY_OPTIONS = PRODUCT_CATEGORIES.map(category => ({
  label: category.label,
  value: category.label,
}))