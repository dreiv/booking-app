import { vi } from 'vitest'

export const useStayDetails = vi.fn((_id: string) => {
  // Default mock behavior: returning "loading"
  // You can override this inside your specific tests
  return {
    data: null,
    isLoading: true,
    isError: false,
    error: null,
  }
})
