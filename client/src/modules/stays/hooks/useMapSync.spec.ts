import { act, renderHook } from '@testing-library/react'
import { useMapEvents } from 'react-leaflet'
import { useSearchParams } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useMapSync } from './useMapSync'

vi.mock('react-leaflet', () => ({
  useMapEvents: vi.fn(),
}))

vi.mock('react-router', () => ({
  useSearchParams: vi.fn(),
}))

describe('useMapSync', () => {
  const mockSetSearchParams = vi.fn()
  const mockMap = {
    getBounds: vi.fn().mockReturnValue({
      getNorthWest: () => ({ lat: 45.1234567, lng: 25.1234567 }),
      getSouthEast: () => ({ lat: 44.1234567, lng: 24.1234567 }),
    }),
  } as unknown as L.Map

  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers() // Critical for testing setTimeout logic

    vi.mocked(useSearchParams).mockReturnValue([new URLSearchParams(), mockSetSearchParams])
    vi.mocked(useMapEvents).mockReturnValue(mockMap)
  })

  it('registers the moveend event on initialization', () => {
    renderHook(() => useMapSync())
    expect(useMapEvents).toHaveBeenCalledWith({
      moveend: expect.any(Function),
    })
  })

  it('updates URL search params after a 400ms debounce', () => {
    renderHook(() => useMapSync())

    const { moveend } = vi.mocked(useMapEvents).mock.calls[0][0] as any

    act(() => {
      moveend()
    })

    expect(mockSetSearchParams).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(400)
    })

    // Verify params are set with 6 decimal precision and page 1 reset
    expect(mockSetSearchParams).toHaveBeenCalled()
    const resultParams = mockSetSearchParams.mock.calls[0][0]

    expect(resultParams.get('nwLat')).toBe('45.123457') // Rounded to 6 decimals
    expect(resultParams.get('page')).toBe('1')
  })

  it('cancels the previous timer if moveend is called again within 400ms', () => {
    renderHook(() => useMapSync())
    const { moveend } = vi.mocked(useMapEvents).mock.calls[0][0] as any

    act(() => {
      moveend()
      vi.advanceTimersByTime(200) // Halfway through debounce
      moveend() // Trigger again
      vi.advanceTimersByTime(300)
    })

    // At 500ms total, it should have only been called once because the first was cleared
    expect(mockSetSearchParams).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(100) // Complete second timer
    })

    expect(mockSetSearchParams).toHaveBeenCalledTimes(1)
  })
})
