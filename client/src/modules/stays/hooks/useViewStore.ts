import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ViewStore {
  viewMode: 'grid' | 'map'
  setViewMode: (mode: 'grid' | 'map') => void
}

export const useViewStore = create<ViewStore>()(
  persist(
    (set) => ({
      viewMode: 'grid',
      setViewMode: (mode) => set({ viewMode: mode }),
    }),
    { name: 'stay-easy-view-preference' },
  ),
)
