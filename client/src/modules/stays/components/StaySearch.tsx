import { Search } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router'

export const StaySearch: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const inputRef = useRef<HTMLInputElement>(null)

  const [localLocation, setLocalLocation] = useState(searchParams.get('location') || '')

  const minPrice = searchParams.get('minPrice') || ''
  const maxPrice = searchParams.get('maxPrice') || ''
  const sort = searchParams.get('sort') || 'newest'

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams)
      if (localLocation.trim()) {
        params.set('location', localLocation.trim())
      } else {
        params.delete('location')
      }
      params.set('page', '1')
      setSearchParams(params)
    }, 500)

    return () => clearTimeout(timer)
  }, [localLocation])

  useEffect(() => {
    const urlLocation = searchParams.get('location') || ''
    if (urlLocation !== localLocation) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocalLocation(urlLocation)
    }
  }, [searchParams])

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

  const handleInstantChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    const params = new URLSearchParams(searchParams)

    if (value) params.set(name, value)
    else params.delete(name)

    params.set('page', '1')
    setSearchParams(params)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    const params = new URLSearchParams(searchParams)
    params.set('page', '1')
    setSearchParams(params)
  }

  return (
    <form onSubmit={handleSearch} className="mx-auto mb-12 w-full max-w-5xl px-4">
      <div className="flex flex-col gap-4 rounded-3xl border-2 border-gray-100 bg-white p-2 shadow-xl md:flex-row md:items-center md:gap-0 md:rounded-2xl">
        <div className="flex flex-[2] items-center px-4">
          <Search className="mr-3 text-gray-400" size={20} />
          <div className="flex-1">
            <label className="flex justify-between text-[10px] font-bold tracking-wider text-gray-400 uppercase">
              Where
              <kbd className="hidden font-sans opacity-50 md:block">⌘K</kbd>
            </label>
            <input
              name="location"
              ref={inputRef}
              type="text"
              placeholder="Search city..."
              className="w-full bg-transparent text-base font-bold text-gray-800 outline-none placeholder:font-medium"
              value={localLocation}
              onChange={(e) => setLocalLocation(e.target.value)}
            />
          </div>
        </div>

        <div className="hidden h-10 w-[1px] bg-gray-100 md:block" />

        <div className="flex flex-1 items-center px-4">
          <div className="flex-1">
            <label className="block text-[10px] font-bold tracking-wider text-gray-400 uppercase">
              Price Range
            </label>
            <div className="flex items-center gap-2">
              <input
                name="minPrice"
                type="number"
                placeholder="Min"
                className="w-full bg-transparent text-sm font-bold text-gray-800 outline-none"
                value={minPrice}
                onChange={handleInstantChange}
              />
              <span className="text-gray-300">-</span>
              <input
                name="maxPrice"
                type="number"
                placeholder="Max"
                className="w-full bg-transparent text-sm font-bold text-gray-800 outline-none"
                value={maxPrice}
                onChange={handleInstantChange}
              />
            </div>
          </div>
        </div>

        <div className="hidden h-10 w-[1px] bg-gray-100 md:block" />

        <div className="flex flex-1 items-center px-4">
          <div className="flex-1">
            <label className="block text-[10px] font-bold tracking-wider text-gray-400 uppercase">
              Sort By
            </label>
            <select
              name="sort"
              value={sort}
              onChange={handleInstantChange}
              className="w-full cursor-pointer appearance-none bg-transparent text-sm font-bold text-gray-800 outline-none"
            >
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating_desc">Top Rated</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="flex items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-8 py-4 font-bold text-white shadow-lg shadow-purple-200 transition-all hover:brightness-110 active:scale-95"
        >
          <Search size={18} strokeWidth={3} />
          <span>Search</span>
        </button>
      </div>
    </form>
  )
}
