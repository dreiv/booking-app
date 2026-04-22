import { http } from '@/core/services/http'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAddReview } from './useAddReview'

vi.mock('@/core/services/http')

describe('useAddReview', () => {
  const stayId = 'stay-123'
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  beforeEach(() => {
    vi.clearAllMocks()
    queryClient.clear()
  })

  it('calls the correct endpoint and invalidates cache on success', async () => {
    const mockReview = { authorName: 'Andrei', rating: 5, comment: 'Excellent' }
    vi.mocked(http.post).mockResolvedValue({ data: { id: 'new-id', ...mockReview } })

    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

    const { result } = renderHook(() => useAddReview(stayId), { wrapper })

    result.current.mutate(mockReview)

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(http.post).toHaveBeenCalledWith(`/stays/${stayId}/reviews`, mockReview)

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ['stays', stayId],
    })
  })

  it('handles errors correctly', async () => {
    vi.mocked(http.post).mockRejectedValue(new Error('Network Error'))

    const { result } = renderHook(() => useAddReview(stayId), { wrapper })

    result.current.mutate({ authorName: 'A', rating: 1, comment: 'Bad' })

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error).toBeDefined()
  })
})
