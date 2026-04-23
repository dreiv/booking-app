import { http } from '@/core/services/http'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { type BookingPayload } from '../types'
import { useCheckout } from './useCheckout'

vi.mock('@/core/services/http')

const mockNavigate = vi.fn()
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router')
  return { ...actual, useNavigate: () => mockNavigate }
})

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useCheckout', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('should successfully book and redirect', async () => {
    const mockResponse = { message: 'Success', booking: { id: 'bk-123' } }

    const payload: BookingPayload = {
      stayId: 'stay-1',
      guestName: 'John Doe',
      guestEmail: 'john@example.com',
      checkIn: new Date().toISOString(),
      checkOut: new Date().toISOString(),
      totalPrice: 100,
    }

    vi.mocked(http.post).mockResolvedValue(mockResponse)

    const { result } = renderHook(() => useCheckout(), { wrapper: createWrapper() })

    result.current.mutate(payload)

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    const storedData = JSON.parse(localStorage.getItem('stay-easy-bookings') || '{}')
    expect(storedData.state.bookedStayIds).toContain('stay-1')

    expect(mockNavigate).toHaveBeenCalledWith('/bookings')
  })

  it('should handle mutation errors', async () => {
    vi.mocked(http.post).mockRejectedValue(new Error('Server Down'))

    const { result } = renderHook(() => useCheckout(), {
      wrapper: createWrapper(),
    })

    result.current.mutate({} as BookingPayload)

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(mockNavigate).not.toHaveBeenCalled()

    const storedData = localStorage.getItem('stay-easy-bookings')
    if (storedData) {
      expect(JSON.parse(storedData).state.bookedStayIds).toHaveLength(0)
    }
  })
})
