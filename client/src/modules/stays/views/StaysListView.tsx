import React from 'react'
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

  const updateParams = (newParams: Record<string, string | number>) => {
    const current = Object.fromEntries(searchParams.entries())

    const merged = { ...current, ...newParams }
    const stringifiedParams: Record<string, string> = {}

    Object.entries(merged).forEach(([key, value]) => {
      stringifiedParams[key] = String(value)
    })

    setSearchParams(stringifiedParams)
  }

  if (isError)
    return <div className="p-20 text-center font-bold text-red-500">Error: {error?.message}</div>

  const stays = data?.data || []
  const meta = data?.meta

  return (
    <section className="container-root py-6">
      <StaySearch />

      <div
        className={`transition-opacity duration-300 ${isPlaceholderData ? 'opacity-50' : 'opacity-100'}`}
      >
        <div className="mb-8 flex flex-col items-start justify-between gap-4 px-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
              {location ? `Available in ${location}` : 'Explore trending stays'}
            </h2>
            {location && (
              <button
                onClick={() => setSearchParams({})}
                className="mt-1 text-sm font-bold text-[var(--accent)] hover:underline"
              >
                ← Show all destinations
              </button>
            )}
          </div>

          {meta && (
            <span className="rounded-full border border-purple-100 bg-purple-50 px-4 py-2 text-sm font-bold text-[var(--accent)]">
              {stays.length} of {meta.totalCount} results
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-8 p-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-96 animate-pulse rounded-3xl bg-gray-100" />
            ))}
          </div>
        ) : stays.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 p-4 sm:grid-cols-2 lg:grid-cols-3">
            {stays.map((stay) => (
              <StayCard key={stay.id} stay={stay} />
            ))}
          </div>
        ) : (
          <div className="mx-4 rounded-3xl bg-gray-50 py-32 text-center">
            <p className="text-2xl font-medium text-gray-400">No results for "{location}"</p>
            <p className="mt-2 text-gray-500">
              Try searching for another city or clear the filter.
            </p>
          </div>
        )}

        {meta && meta.totalPages > 1 && (
          <div className="mt-16 flex items-center justify-center gap-6 pb-20">
            <button
              onClick={() => updateParams({ page: Math.max(page - 1, 1) })}
              disabled={page === 1}
              className="w-32 rounded-2xl border-2 border-gray-200 py-3 font-bold transition-all hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-30 disabled:hover:border-gray-200 disabled:hover:text-inherit"
            >
              Previous
            </button>

            <div className="flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl font-bold text-white">
                {page}
              </span>
              <span className="mx-1 font-bold text-gray-400">/</span>
              <span className="font-bold text-gray-700">{meta.totalPages}</span>
            </div>

            <button
              onClick={() => updateParams({ page: page + 1 })}
              disabled={!meta.hasNextPage}
              className="w-32 rounded-2xl border-2 border-gray-200 py-3 font-bold transition-all hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-30 disabled:hover:border-gray-200 disabled:hover:text-inherit"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
