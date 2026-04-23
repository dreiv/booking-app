import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface FavoritesState {
  favoriteIds: string[]
  toggleFavorite: (id: string) => void
}

export const useFavorites = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoriteIds: [],
      toggleFavorite: (id) => {
        const ids = get().favoriteIds
        set({
          favoriteIds: ids.includes(id) ? ids.filter((fId) => fId !== id) : [...ids, id],
        })
      },
    }),
    { name: 'stay-easy-favorites' },
  ),
)
