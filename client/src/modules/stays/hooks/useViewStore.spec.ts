import { act } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { useViewStore } from './useViewStore'

describe('useViewStore', () => {
  beforeEach(() => {
    act(() => {
      useViewStore.getState().setViewMode('grid')
    })

    localStorage.clear()
  })

  it('should have "grid" as the initial viewMode', () => {
    const state = useViewStore.getState()
    expect(state.viewMode).toBe('grid')
  })

  it('should update the viewMode when setViewMode is called', () => {
    act(() => {
      useViewStore.getState().setViewMode('map')
    })

    expect(useViewStore.getState().viewMode).toBe('map')
  })

  it('should persist the state to localStorage', () => {
    const storageKey = 'stay-easy-view-preference'

    act(() => {
      useViewStore.getState().setViewMode('map')
    })

    const storedData = JSON.parse(localStorage.getItem(storageKey) || '{}')

    expect(storedData.state.viewMode).toBe('map')
  })

  it('should toggle between grid and map correctly', () => {
    act(() => {
      useViewStore.getState().setViewMode('map')
    })
    expect(useViewStore.getState().viewMode).toBe('map')

    act(() => {
      useViewStore.getState().setViewMode('grid')
    })
    expect(useViewStore.getState().viewMode).toBe('grid')
  })
})
