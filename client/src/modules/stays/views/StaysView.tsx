import { ChevronLeft, ChevronRight, LayoutGrid, Map as MapIcon, RotateCcw } from 'lucide-react'
import React, { useEffect } from 'react'
import { useSearchParams } from 'react-router'
import { StayGrid } from '../components/StayGrid'
import { StaySearch } from '../components/StaySearch'
import { StaysMap } from '../components/StaysMap'
import { useStays } from '../hooks/useStays'
import { useViewStore } from '../hooks/useViewStore'
import type { StaySortOption } from '../types'

export const StaysView: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { viewMode, setViewMode } = useViewStore()

  const page = Number(searchParams.get('page')) || 1
  const location = searchParams.get('location') || ''
  const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined
  const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined
  const sort = (searchParams.get('sort') as StaySortOption) || 'newest'

  const nwLat = searchParams.get('nwLat') ? Number(searchParams.get('nwLat')) : undefined
  const nwLng = searchParams.get('nwLng') ? Number(searchParams.get('nwLng')) : undefined
  const seLat = searchParams.get('seLat') ? Number(searchParams.get('seLat')) : undefined
  const seLng = searchParams.get('seLng') ? Number(searchParams.get('seLng')) : undefined

  const limit = viewMode === 'map' ? 99 : 9

  const { data, isLoading, isError, error, isPlaceholderData } = useStays({
    page,
    limit,
    location,
    minPrice,
    maxPrice,
    sort,
    nwLat,
    nwLng,
    seLat,
    seLng,
  })

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [page])

  const handleViewChange = (newMode: 'grid' | 'map') => {
    if (newMode === viewMode) return

    const params = new URLSearchParams(searchParams)

    if (newMode === 'grid') {
      params.delete('nwLat')
      params.delete('nwLng')
      params.delete('seLat')
      params.delete('seLng')
    }

    params.set('page', '1')

    setSearchParams(params)
    setViewMode(newMode)
  }

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', String(newPage))
    setSearchParams(params)
  }

  const handleClearFilters = () => setSearchParams({})

  if (isError) {
    return (
      <div className="bg-[var(--bg-root)] p-20 text-center text-[var(--text-h)]">
        <p className="text-xl font-bold text-red-500">Something went wrong</p>
        <p className="mt-2 opacity-70">{error?.message}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 rounded-xl bg-gray-900 px-6 py-2 font-bold text-white transition-transform active:scale-95"
        >
          Try again
        </button>
      </div>
    )
  }

  const stays = data?.data || []
  const meta = data?.meta

  return (
    <section className="container-root flex min-h-screen flex-col bg-[var(--bg-root)] py-6">
      <div className="px-4">
        <StaySearch />
      </div>

      <header className="my-8 flex flex-col items-start justify-between gap-4 px-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-[var(--text-h)]">
            {location ? `Stays in "${location}"` : 'Explore trending stays'}
          </h2>
          {(location || minPrice || maxPrice || nwLat) && (
            <button
              onClick={handleClearFilters}
              className="mt-1 flex items-center gap-1 text-sm font-bold text-[var(--accent)] hover:underline"
            >
              <RotateCcw size={14} /> Clear all filters
            </button>
          )}
        </div>

        <div className="flex items-center gap-4">
          {meta && stays.length > 0 && (
            <span className="hidden rounded-full border border-[var(--border)] bg-[var(--bg-card)] px-4 py-2 text-sm font-bold text-[var(--accent)] sm:inline-block">
              {meta.totalCount} properties
            </span>
          )}

          <div className="flex rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-1">
            <button
              onClick={() => handleViewChange('grid')}
              className={`rounded-lg p-2 transition-all ${viewMode === 'grid' ? 'bg-[var(--accent)] text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
              aria-label="Grid view"
            >
              <LayoutGrid size={20} />
            </button>
            <button
              onClick={() => handleViewChange('map')}
              className={`rounded-lg p-2 transition-all ${viewMode === 'map' ? 'bg-[var(--accent)] text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
              aria-label="Map view"
            >
              <MapIcon size={20} />
            </button>
          </div>
        </div>
      </header>

      <div
        className={`flex-1 transition-opacity duration-300 ${isPlaceholderData ? 'pointer-events-none opacity-50' : 'opacity-100'}`}
      >
        {viewMode === 'grid' ? (
          <>
            <StayGrid
              stays={stays}
              loading={isLoading}
              emptyMessage={location ? `No stays found in "${location}".` : 'No matches.'}
            />

            {meta && meta.totalPages > 1 && (
              <nav
                className="mt-16 flex items-center justify-center gap-4 pb-20"
                aria-label="Pagination"
              >
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="flex items-center gap-2 rounded-xl border-2 border-[var(--border)] bg-[var(--bg-card)] px-4 py-2 font-bold text-[var(--text-h)] transition-all hover:bg-gray-50 active:scale-95 disabled:opacity-20"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="flex items-center gap-2 text-lg">
                  <span className="font-black text-[var(--accent)]">{page}</span>
                  <span className="text-gray-300">/</span>
                  <span className="font-bold text-[var(--text-p)]">{meta.totalPages}</span>
                </div>
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={!meta.hasNextPage}
                  className="flex items-center gap-2 rounded-xl border-2 border-[var(--border)] bg-[var(--bg-card)] px-4 py-2 font-bold text-[var(--text-h)] transition-all hover:bg-gray-50 active:scale-95 disabled:opacity-20"
                >
                  <ChevronRight size={20} />
                </button>
              </nav>
            )}
          </>
        ) : (
          <div className="flex h-[75vh] w-full overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] shadow-2xl">
            <aside className="custom-scrollbar hidden w-[400px] flex-col overflow-y-auto border-r border-[var(--border)] md:flex">
              <div className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--bg-card)]/80 p-4 backdrop-blur-md">
                <p className="text-sm font-bold text-[var(--text-p)] opacity-70">
                  Showing {stays.length} properties in this area
                </p>
              </div>
              <div className="p-2">
                <StayGrid stays={stays} loading={isLoading} variant="compact" />
              </div>
            </aside>
            <div className="relative flex-1">
              <StaysMap stays={stays} isLoading={isLoading} />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
