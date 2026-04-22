import { vi } from 'vitest'

export const useBookings = vi.fn(() => ({
  data: [],
  isLoading: false,
  isError: false,
}))
