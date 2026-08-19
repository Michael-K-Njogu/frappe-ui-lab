export const SECTORS = [
  {
    label: 'Finance',
    value: 'finance',
  },
  {
    label: 'Healthcare',
    value: 'healthcare',
  },
  {
    label: 'Information Technology',
    value: 'information_technology',
  },
  {
    label: 'Government',
    value: 'government',
  },
  {
    label: 'Education',
    value: 'education',
  },
  {
    label: 'Real Estate',
    value: 'real_estate',
  },
  {
    label: 'Manufacturing',
    value: 'manufacturing',
  },
  {
    label: 'Transportation & Logistics',
    value: 'transportation_logistics',
  },
  {
    label: 'Energy & Utilities',
    value: 'energy_utilities',
  },
  {
    label: 'Telecommunications',
    value: 'telecommunications',
  },
  {
    label: 'Media & Entertainment',
    value: 'media_entertainment',
  },
  {
    label: 'Hospitality & Tourism',
    value: 'hospitality_tourism',
  },
  {
    label: 'Agriculture',
    value: 'agriculture',
  },
  {
    label: 'Nonprofit & NGOs',
    value: 'nonprofit_ngos',
  },
]

export const SECTOR_OPTIONS = SECTORS.map((category) => ({
  label: category.label,
  value: category.label,
}))
