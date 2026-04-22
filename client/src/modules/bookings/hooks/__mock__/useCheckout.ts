import { vi } from 'vitest'

export const useCheckout = vi.fn(() => {
  return {
    mutate: vi.fn(),
    isPending: false,
    isSuccess: false,
    isError: false,
  }
})
