import { Search } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router'

export const StaySearch: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('location') || '')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

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
      <div className="flex items-center gap-2 rounded-2xl border-2 border-gray-100 bg-white p-1.5 shadow-xl transition-shadow duration-300 hover:shadow-2xl">
        <div className="flex flex-1 items-center px-2 md:px-4">
          <Search className="mr-2 text-gray-400 md:mr-3" size={20} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search city..."
            className="w-full bg-transparent py-3 text-base font-medium text-gray-800 outline-none md:py-4 md:text-lg"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <div className="hidden items-center gap-1 rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-[10px] font-bold text-gray-400 lg:flex">
            <span className="text-xs">⌘</span> K
          </div>
        </div>

        <button
          type="submit"
          aria-label="Search"
          className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent)] font-bold text-white transition-all hover:brightness-110 active:scale-95 md:h-auto md:w-auto md:px-10 md:py-4"
        >
          <span className="md:hidden">
            <Search size={20} strokeWidth={3} />
          </span>
          <span className="hidden text-lg md:block">Search</span>
        </button>
      </div>
    </form>
  )
}
