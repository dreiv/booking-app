import { http } from '@/core/services/http'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useCheckout } from './useCheckout'

vi.mock('@/core/services/http')

const mockNavigate = vi.fn()
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useCheckout', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    vi.stubGlobal('alert', vi.fn())
  })

  it('should successfully book and redirect', async () => {
    const mockResponse = { booking: { id: 'bk-123' } }
    const payload = { hotelId: '1', dates: { from: 'today', to: 'tomorrow' } }

    vi.mocked(http.post).mockResolvedValue(mockResponse)

    const { result } = renderHook(() => useCheckout(), { wrapper: createWrapper() })

    result.current.mutate(payload as any)
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    const stored = JSON.parse(localStorage.getItem('my_bookings') || '[]')
    expect(stored).toContain('bk-123')

    expect(window.alert).toHaveBeenCalledWith('Booking Successful!')
    expect(mockNavigate).toHaveBeenCalledWith('/my-bookings')
  })

  it('should handle mutation errors', async () => {
    vi.mocked(http.post).mockRejectedValue(new Error('Server Down'))

    const { result } = renderHook(() => useCheckout(), {
      wrapper: createWrapper(),
    })

    result.current.mutate({} as any)

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(mockNavigate).not.toHaveBeenCalled()
    expect(localStorage.getItem('my_bookings')).toBeNull()
  })
})
