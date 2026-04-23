import { StayGrid } from '@/modules/stays/components/StayGrid'
import { useStays } from '@/modules/stays/hooks/useStays'
import { useFavorites } from '../hooks/useFavorites'

export const FavoritesView = () => {
  const favoriteIds = useFavorites((state) => state.favoriteIds)

  const { data, isLoading } = useStays(
    { ids: favoriteIds, limit: 100 },
    { enabled: favoriteIds.length > 0 },
  )

  const favoriteStays = data?.data || []
  const isFetching = isLoading && favoriteIds.length > 0

  return (
    <section className="container-root py-8">
      <header className="mb-10 px-4">
        <h1 className="text-4xl font-black tracking-tight text-[var(--text-h)]">Your Favorites</h1>
        <p className="mt-2 text-lg font-medium text-[var(--text)] opacity-60">
          {favoriteIds.length} {favoriteIds.length === 1 ? 'stay' : 'stays'} saved
        </p>
      </header>

      <StayGrid
        stays={favoriteStays}
        loading={isFetching}
        emptyMessage="You haven't saved any stays yet. Click the heart icon on a stay to save it!"
      />
    </section>
  )
}
