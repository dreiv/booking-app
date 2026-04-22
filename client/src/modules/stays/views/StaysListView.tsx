import React, { useEffect } from 'react'
import { useSearchParams } from 'react-router'
import { StayCard } from '../components/StayCard'
import { StaySearch } from '../components/StaySearch'
import { useStays } from '../hooks/useStays'

export const StaysListView: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const page = Number(searchParams.get('page')) || 1
  const location = searchParams.get('location') || ''
  const limit = 9

  const { data, isLoading, isError, error, isPlaceholderData } = useStays({
    page,
    limit,
    location,
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
        <p className="font-bold text-red-500">Error: {error?.message}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 text-[var(--accent)] underline"
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
        className={`transition-opacity duration-300 ${
          isPlaceholderData ? 'pointer-events-none opacity-50' : 'opacity-100'
        }`}
      >
        <header className="mb-8 flex flex-col items-start justify-between gap-4 px-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-[var(--text-h)]">
              {location ? `Stays in ${location}` : 'Explore trending stays'}
            </h2>
            {location && (
              <button
                onClick={handleClearFilters}
                className="mt-1 flex items-center gap-1 text-sm font-bold text-[var(--accent)] hover:underline"
              >
                <span className="i-lucide-x h-3 w-3" /> Clear filters
              </button>
            )}
          </div>

          {meta && stays.length > 0 && (
            <span className="rounded-full border border-purple-100 bg-purple-50 px-4 py-2 text-sm font-bold text-[var(--accent)]">
              {stays.length} of {meta.totalCount} results
            </span>
          )}
        </header>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-8 p-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 animate-pulse rounded-3xl bg-gray-100" />
            ))}
          </div>
        ) : stays.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 p-4 sm:grid-cols-2 lg:grid-cols-3">
            {stays.map((stay) => (
              <StayCard key={stay.id} stay={stay} />
            ))}
          </div>
        ) : (
          <div className="mx-4 rounded-3xl border-2 border-dashed border-gray-200 py-32 text-center">
            <div className="i-lucide-search mx-auto mb-4 h-12 w-12 text-gray-300" />
            <p className="text-2xl font-bold text-gray-400">No results for "{location}"</p>
            <p className="mt-2 text-gray-500">
              Try a different city or browse all available destinations.
            </p>
            <button
              onClick={handleClearFilters}
              className="mt-6 rounded-xl bg-gray-900 px-6 py-3 font-bold text-white transition-transform active:scale-95"
            >
              Show all stays
            </button>
          </div>
        )}

        {meta && meta.totalPages > 1 && (
          <nav
            className="mt-16 flex items-center justify-center gap-6 pb-20"
            aria-label="Pagination"
          >
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="w-32 rounded-2xl border-2 border-gray-200 py-3 font-bold transition-all hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-20"
            >
              Previous
            </button>

            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)] font-bold text-white shadow-md shadow-purple-200">
                {page}
              </span>
              <span className="font-bold text-gray-300">of</span>
              <span className="font-bold text-gray-700">{meta.totalPages}</span>
            </div>

            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={!meta.hasNextPage}
              className="w-32 rounded-2xl border-2 border-gray-200 py-3 font-bold transition-all hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-20"
            >
              Next
            </button>
          </nav>
        )}
      </div>
    </section>
  )
}
