// Generate order number based on the current date and a random number
export function generateOrderNumber() {
  const date = new Date()
  const year = date.getFullYear().toString().slice(-2) // Get last two digits of the year
  const month = (date.getMonth() + 1).toString().padStart(2, '0') // Get month and pad with leading zero
  const day = date.getDate().toString().padStart(2, '0') // Get day and pad with leading zero
  const randomNum = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0') // Generate a random number and pad with leading zeros

  return `ORD-${year}${month}${day}-${randomNum}` // Format the order number
}
