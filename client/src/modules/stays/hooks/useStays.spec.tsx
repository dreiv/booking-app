import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { staysService } from '../services/api'
import { useStays } from './useStays'

vi.mock('../services/api')

describe('useStays', () => {
  let queryClient: QueryClient
  let wrapper: React.FC<{ children: React.ReactNode }>

  beforeEach(() => {
    vi.clearAllMocks()
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,

          gcTime: 0,
        },
      },
    })
    wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
  })

  it('fetches stays with default empty parameters', async () => {
    const mockData = { data: [{ id: '1', name: 'Cabin' }] }
    vi.mocked(staysService.getAll).mockResolvedValue(mockData as any)

    const { result } = renderHook(() => useStays(), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(staysService.getAll).toHaveBeenCalledWith({})
    expect(result.current.data).toEqual(mockData)
  })

  it('fetches stays with provided parameters and includes them in queryKey', async () => {
    const mockData = { data: [{ id: '1', name: 'Luxury Villa' }] }
    vi.mocked(staysService.getAll).mockResolvedValue(mockData as any)

    const params = { location: 'Cluj', minPrice: 500 }
    const { result } = renderHook(() => useStays(params), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(staysService.getAll).toHaveBeenCalledWith(params)
    expect(result.current.isSuccess).toBe(true)
  })

  it('respects custom options passed to the hook', async () => {
    const mockData = { data: [] }
    vi.mocked(staysService.getAll).mockResolvedValue(mockData as any)

    const { result } = renderHook(() => useStays({}, { enabled: false }), { wrapper })

    expect(result.current.status).toBe('pending')
    expect(staysService.getAll).not.toHaveBeenCalled()
  })

  it('uses previous data as placeholder when parameters change', async () => {
    const firstData = { data: [{ id: '1', name: 'First' }] }
    const secondData = { data: [{ id: '2', name: 'Second' }] }

    vi.mocked(staysService.getAll).mockResolvedValueOnce(firstData as any)

    const { result, rerender } = renderHook(({ params }) => useStays(params), {
      wrapper,
      initialProps: { params: { location: 'A' } },
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(firstData)

    vi.mocked(staysService.getAll).mockReturnValue(
      new Promise((resolve) => setTimeout(() => resolve(secondData as any), 100)),
    )

    rerender({ params: { location: 'B' } })

    expect(result.current.isFetching).toBe(true)
    expect(result.current.data).toEqual(firstData)

    await waitFor(() => expect(result.current.data).toEqual(secondData))
  })
})
