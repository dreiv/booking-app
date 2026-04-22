import { vi } from 'vitest'

export const formatCurrency = vi.fn((amount: number) => `${amount} RON`)

export const formatDate = vi.fn((_date: string | Date) => {
  // We use a fixed date in mocks to prevent "time-travel" bugs in tests
  return '1 Jan 2026'
})
