/**
 * Formats a number as Romanian Leu (RON)
 * Example: 1200 -> 1.200 lei
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ro-RO', {
    style: 'currency',
    currency: 'RON',
    maximumFractionDigits: 0, // Stay prices usually don't need decimals
  }).format(amount)
}

/**
 * Formats a date to a readable string
 * Example: 2023-10-01 -> 1 Oct 2023
 */
export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat('ro-RO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}
