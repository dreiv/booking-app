import React, { useState } from 'react'
import { useSearchParams } from 'react-router'

export const StaySearch: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('location') || '')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      setSearchParams({ location: query.trim(), page: '1' })
    } else {
      setSearchParams({})
    }
  }

  return (
    <form onSubmit={handleSearch} className="mx-auto mb-12 w-full max-w-4xl px-4">
      <div className="flex items-center rounded-2xl border-2 border-gray-100 bg-white p-2 shadow-xl transition-shadow duration-300 hover:shadow-2xl">
        <div className="flex flex-1 items-center px-4">
          <span className="mr-2 text-xl text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Search by city (e.g. Cluj, Sinaia, Brașov...)"
            className="w-full bg-transparent py-4 text-lg font-medium text-gray-800 outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="rounded-xl bg-[var(--accent)] px-10 py-4 text-lg font-bold text-white transition-all hover:brightness-110 active:scale-95"
        >
          Search
        </button>
      </div>
    </form>
  )
}
