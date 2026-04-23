import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { useFavorites } from './useFavorites'

describe('useFavorites Store', () => {
  beforeEach(() => {
    act(() => {
      useFavorites.setState({ favoriteIds: [] })
    })
    localStorage.clear()
  })

  it('should start with an empty list of favorite IDs', () => {
    const { result } = renderHook(() => useFavorites())
    expect(result.current.favoriteIds).toEqual([])
  })

  it('should add an ID to favorites when toggleFavorite is called', () => {
    const { result } = renderHook(() => useFavorites())

    act(() => {
      result.current.toggleFavorite('stay-1')
    })

    expect(result.current.favoriteIds).toContain('stay-1')
  })

  it('should remove an ID from favorites if it already exists', () => {
    const { result } = renderHook(() => useFavorites())

    act(() => {
      result.current.toggleFavorite('stay-1')
    })
    expect(result.current.favoriteIds).toContain('stay-1')

    act(() => {
      result.current.toggleFavorite('stay-1')
    })

    expect(result.current.favoriteIds).not.toContain('stay-1')
  })

  it('should persist favorites to localStorage', () => {
    const { result } = renderHook(() => useFavorites())

    act(() => {
      result.current.toggleFavorite('persist-me')
    })

    const storedValue = JSON.parse(localStorage.getItem('stay-easy-favorites') || '{}')
    expect(storedValue.state.favoriteIds).toContain('persist-me')
  })

  it('should handle multiple favorites independently', () => {
    const { result } = renderHook(() => useFavorites())

    act(() => {
      result.current.toggleFavorite('stay-1')
      result.current.toggleFavorite('stay-2')
      result.current.toggleFavorite('stay-3')
    })

    expect(result.current.favoriteIds).toHaveLength(3)

    act(() => {
      result.current.toggleFavorite('stay-2')
    })

    expect(result.current.favoriteIds).toEqual(['stay-1', 'stay-3'])
  })
})
