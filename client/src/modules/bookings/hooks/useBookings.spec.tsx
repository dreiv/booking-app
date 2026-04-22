import { http } from '@/core/services/http'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useBookings } from './useBookings'

vi.mock('@/core/services/http')

describe('useBookings hook', () => {
  const createWrapper = () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    })

    return ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches and returns bookings successfully', async () => {
    const mockData = [{ id: '1', status: 'Confirmed', stay: { name: 'Test Stay' } }]
    vi.mocked(http.get).mockResolvedValue(mockData)

    const { result } = renderHook(() => useBookings(), {
      wrapper: createWrapper(),
    })

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual(mockData)
    expect(http.get).toHaveBeenCalledWith('/bookings')
  })

  it('handles errors gracefully', async () => {
    vi.mocked(http.get).mockRejectedValue(new Error('API Error'))

    const { result } = renderHook(() => useBookings(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error).toBeDefined()
  })
})
