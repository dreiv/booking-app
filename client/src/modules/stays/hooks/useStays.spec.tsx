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
      defaultOptions: { queries: { retry: false } },
    })
    wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
  })

  it('fetches stays with provided parameters', async () => {
    const mockData = [{ id: '1', name: 'Cabin' }]
    vi.mocked(staysService.getAll).mockResolvedValue(mockData as any)

    const params = { location: 'Cluj' }
    const { result } = renderHook(() => useStays(params), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(staysService.getAll).toHaveBeenCalledWith(params)
    expect(result.current.data).toEqual(mockData)
  })
})
