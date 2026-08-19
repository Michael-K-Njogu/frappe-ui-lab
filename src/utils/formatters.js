export function formatCurrency(value) {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
  }).format(value)
}

export function formatDate(value) {
  return new Intl.DateTimeFormat('en-KE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function formatRelativeDate(date) {
  if (!date) return ''

  const now = new Date()
  const target = new Date(date)

  const seconds = Math.floor((now - target) / 1000)

  if (seconds < 10) {
    return 'Just now'
  }

  if (seconds < 60) {
    return `${seconds} seconds ago`
  }

  const minutes = Math.floor(seconds / 60)

  if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
  }

  const hours = Math.floor(minutes / 60)

  if (hours < 24) {
    return `${hours} hour${hours === 1 ? '' : 's'} ago`
  }

  const days = Math.floor(hours / 24)

  if (days === 1) {
    return 'Yesterday'
  }

  if (days < 7) {
    return `${days} days ago`
  }

  if (days < 30) {
    const weeks = Math.floor(days / 7)
    return `${weeks} week${weeks === 1 ? '' : 's'} ago`
  }

  return formatDate(date)
}
