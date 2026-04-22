import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import React from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { staysService } from '../services/api'
import { useStayDetails } from './useStayDetails'

vi.mock('../services/api')

describe('useStayDetails', () => {
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

  it('fetches stay details by id', async () => {
    const mockStay = { id: '123', name: 'Castle' }
    vi.mocked(staysService.getById).mockResolvedValue(mockStay as any)

    const { result } = renderHook(() => useStayDetails('123'), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(staysService.getById).toHaveBeenCalledWith('123')
    expect(result.current.data).toEqual(mockStay)
  })

  it('does not run if id is missing', () => {
    const { result } = renderHook(() => useStayDetails(''), { wrapper })

    // If enabled: !!id is working, it should stay in 'pending' (idle) state
    expect(result.current.fetchStatus).toBe('idle')
    expect(staysService.getById).not.toHaveBeenCalled()
  })
})
