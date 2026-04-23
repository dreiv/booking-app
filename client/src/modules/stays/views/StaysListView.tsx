import { ChevronLeft, ChevronRight } from 'lucide-react'
import React, { useEffect } from 'react'
import { useSearchParams } from 'react-router'
import { StayGrid } from '../components/StayGrid'
import { StaySearch } from '../components/StaySearch'
import { useStays } from '../hooks/useStays'
import type { StaySortOption } from '../types'

export const StaysListView: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const page = Number(searchParams.get('page')) || 1
  const location = searchParams.get('location') || ''
  const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined
  const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined
  const sort = (searchParams.get('sort') as StaySortOption) || 'newest'
  const limit = 9

  const { data, isLoading, isError, error, isPlaceholderData } = useStays({
    page,
    limit,
    location,
    minPrice,
    maxPrice,
    sort,
  })

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [page])

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', String(newPage))
    setSearchParams(params)
  }

  const handleClearFilters = () => {
    setSearchParams({})
  }

  if (isError) {
    return (
      <div className="p-20 text-center">
        <p className="text-xl font-bold text-red-500">Something went wrong</p>
        <p className="mt-2 text-gray-500">{error?.message}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-6 rounded-xl bg-gray-900 px-6 py-2 font-bold text-white transition-all hover:bg-gray-800"
        >
          Try again
        </button>
      </div>
    )
  }

  const stays = data?.data || []
  const meta = data?.meta

  return (
    <section className="container-root py-6">
      <StaySearch />

      <div
        data-testid="stays-list-content"
        className={`transition-opacity duration-300 ${
          isPlaceholderData ? 'pointer-events-none opacity-50' : 'opacity-100'
        }`}
      >
        <header className="mb-8 flex flex-col items-start justify-between gap-4 px-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-[var(--text-h)]">
              {location ? `Stays in "${location}"` : 'Explore trending stays'}
            </h2>
            {(location || minPrice || maxPrice) && (
              <button
                onClick={handleClearFilters}
                className="mt-1 flex items-center gap-1 text-sm font-bold text-[var(--accent)] hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>

          {meta && stays.length > 0 && (
            <span className="rounded-full border border-purple-100 bg-purple-50 px-4 py-2 text-sm font-bold text-[var(--accent)]">
              {meta.totalCount} properties found
            </span>
          )}
        </header>

        <StayGrid
          stays={stays}
          loading={isLoading}
          emptyMessage={
            location
              ? `We couldn't find any available stays in "${location}".`
              : 'No stays match your current filters.'
          }
        />

        {meta && meta.totalPages > 1 && (
          <nav
            className="mt-16 flex items-center justify-center gap-4 pb-20 md:gap-8"
            aria-label="Pagination"
          >
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="flex items-center gap-2 rounded-xl border-2 border-gray-200 px-4 py-2 font-bold transition-all hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-20 md:px-6 md:py-3"
            >
              <ChevronLeft size={20} />
              <span className="hidden md:inline">Previous</span>
            </button>

            <div className="flex items-center gap-2 text-lg">
              <span className="font-black text-[var(--accent)]">{page}</span>
              <span className="font-bold text-gray-300">/</span>
              <span className="font-bold text-gray-700">{meta.totalPages}</span>
            </div>

            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={!meta.hasNextPage}
              className="flex items-center gap-2 rounded-xl border-2 border-gray-200 px-4 py-2 font-bold transition-all hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-20 md:px-6 md:py-3"
            >
              <span className="hidden md:inline">Next</span>
              <ChevronRight size={20} />
            </button>
          </nav>
        )}
      </div>
    </section>
  )
}
