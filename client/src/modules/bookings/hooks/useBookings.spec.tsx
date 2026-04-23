import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { useBookings } from './useBookings'

describe('useBookings Store', () => {
  beforeEach(() => {
    act(() => {
      useBookings.getState().clearBookings()
    })
    localStorage.clear()
  })

  it('should start with an empty list of booked IDs', () => {
    const { result } = renderHook(() => useBookings())
    expect(result.current.bookedStayIds).toEqual([])
  })

  it('should add a booking ID if it does not exist', () => {
    const { result } = renderHook(() => useBookings())

    act(() => {
      result.current.addBooking('stay-123')
    })

    expect(result.current.bookedStayIds).toContain('stay-123')
    expect(result.current.bookedStayIds).toHaveLength(1)
  })

  it('should not add duplicate booking IDs', () => {
    const { result } = renderHook(() => useBookings())

    act(() => {
      result.current.addBooking('stay-123')
      result.current.addBooking('stay-123')
    })

    expect(result.current.bookedStayIds).toHaveLength(1)
  })

  it('should correctly report isBooked status', () => {
    const { result } = renderHook(() => useBookings())

    act(() => {
      result.current.addBooking('stay-456')
    })

    expect(result.current.isBooked('stay-456')).toBe(true)
    expect(result.current.isBooked('non-existent')).toBe(false)
  })

  it('should clear all bookings', () => {
    const { result } = renderHook(() => useBookings())

    act(() => {
      result.current.addBooking('stay-1')
      result.current.addBooking('stay-2')
      result.current.clearBookings()
    })

    expect(result.current.bookedStayIds).toEqual([])
  })

  it('should persist data to localStorage', () => {
    const { result } = renderHook(() => useBookings())

    act(() => {
      result.current.addBooking('persist-test')
    })

    const storedValue = JSON.parse(localStorage.getItem('stay-easy-bookings') || '{}')
    expect(storedValue.state.bookedStayIds).toContain('persist-test')
  })
})
