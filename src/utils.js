export const money = (value) => `₹${Number(value || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`

export const initials = (name = '') => {
  if (!name) return '??'
  const parts = name.trim().split(' ')
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export const formatDate = (dateInput) => {
  if (!dateInput) return '—'
  if (typeof dateInput === 'string' && (dateInput.includes('Today') || dateInput.includes('Yesterday') || dateInput.includes('Just now'))) {
    return dateInput
  }
  try {
    const d = new Date(dateInput)
    if (isNaN(d.getTime())) return String(dateInput)
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return String(dateInput)
  }
}

export const generateOrderId = (existingCount = 0) => {
  const num = 1050 + existingCount
  return `ORD-${num}`
}

export const generateTxnId = (existingCount = 0) => {
  const num = 2042 + existingCount
  return `TXN-${num}`
}