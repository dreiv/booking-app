import { formatCurrency } from '@/core/utils/formatters'
import React from 'react'
import { Link } from 'react-router'
import type { Stay } from '../types'

interface Props {
  stay: Stay
}

export const StayCard: React.FC<Props> = ({ stay }) => {
  return (
    <Link
      to={`/stays/${stay.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card-bg,transparent)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--code-bg)]">
        {stay.images?.[0] ? (
          <img
            src={stay.images[0]}
            alt={stay.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[var(--text-muted)]">
            No Image
          </div>
        )}
      </div>

      <div className="flex flex-grow flex-col p-5">
        <div className="mb-4">
          <h3 className="line-clamp-1 text-lg leading-tight font-bold text-[var(--text-h)] transition-colors group-hover:text-[var(--accent)]">
            {stay.name}
          </h3>
          <p className="mt-1 flex items-center gap-1 text-sm text-[var(--text)] opacity-70">
            <span className="i-lucide-map-pin h-3 w-3" /> {stay.location}
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-[var(--border)] pt-4">
          <div>
            <p className="text-[10px] font-black tracking-widest text-[var(--text)] uppercase opacity-50">
              Per Night
            </p>
            <p className="text-xl font-black text-[var(--accent)]">{formatCurrency(stay.price)}</p>
          </div>

          <div className="rounded-lg bg-[var(--border)] p-2 text-[var(--text-h)] transition-all group-hover:bg-[var(--accent)] group-hover:text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  )
}
