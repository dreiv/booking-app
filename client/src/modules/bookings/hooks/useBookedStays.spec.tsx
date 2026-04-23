import { staysService } from '@/modules/stays/services/api'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useBookedStays } from './useBookedStays'
import { useBookings } from './useBookings'

vi.mock('@/modules/stays/services/api')
vi.mock('./useBookings')

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

describe('useBookedStays Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return an empty array and not fetch if there are no booked IDs', async () => {
    vi.mocked(useBookings).mockReturnValue({ bookedStayIds: [] } as any)

    const { result } = renderHook(() => useBookedStays(), {
      wrapper: createWrapper(),
    })

    expect(result.current.fetchStatus).toBe('idle')
    expect(staysService.getAll).not.toHaveBeenCalled()
  })

  it('should fetch stay details when booked IDs exist', async () => {
    const mockIds = ['stay-1', 'stay-2']
    const mockStays = [
      { id: 'stay-1', name: 'Beach House' },
      { id: 'stay-2', name: 'Mountain Cabin' },
    ]

    vi.mocked(useBookings).mockReturnValue({ bookedStayIds: mockIds } as any)

    vi.mocked(staysService.getAll).mockResolvedValue({
      data: mockStays,
      total: 2,
      page: 1,
      limit: 100,
    } as any)

    const { result } = renderHook(() => useBookedStays(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual(mockStays)
    expect(staysService.getAll).toHaveBeenCalledWith({
      ids: mockIds,
      limit: 100,
    })
  })

  it('should handle API errors gracefully', async () => {
    vi.mocked(useBookings).mockReturnValue({ bookedStayIds: ['error-id'] } as any)
    vi.mocked(staysService.getAll).mockRejectedValue(new Error('Network Error'))

    const { result } = renderHook(() => useBookedStays(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error).toBeDefined()
  })
})
