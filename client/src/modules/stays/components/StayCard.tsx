import { formatCurrency } from '@/core/utils/formatters'
import { ChevronRight, MapPin } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router'
import type { Stay } from '../types'

interface Props {
  stay: Stay
}

export const StayCard: React.FC<Props> = ({ stay }) => {
  const hasMultipleImages = stay.images && stay.images.length > 1

  return (
    <Link
      to={`/stays/${stay.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card-bg,transparent)] transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/10"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--border)]">
        {stay.images?.[0] ? (
          <>
            <img
              src={stay.images[0]}
              alt={stay.name}
              className={`h-full w-full object-cover transition-all duration-700 ease-in-out group-hover:scale-110 ${
                hasMultipleImages ? 'group-hover:opacity-0' : ''
              }`}
            />
            {hasMultipleImages && (
              <img
                src={stay.images[1]}
                alt={`${stay.name} alternate`}
                className="absolute inset-0 h-full w-full scale-105 object-cover opacity-0 transition-all duration-700 ease-in-out group-hover:scale-110 group-hover:opacity-100"
              />
            )}
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[var(--text-muted)]">
            No Image
          </div>
        )}
      </div>

      <div className="flex flex-grow flex-col p-5">
        <div className="mb-4">
          <h3 className="line-clamp-1 text-lg leading-tight font-black text-[var(--text-h)] transition-colors group-hover:text-[var(--accent)]">
            {stay.name}
          </h3>
          <p className="mt-1.5 flex items-center gap-1 text-sm font-medium text-[var(--text)] opacity-60">
            <MapPin size={14} className="text-[var(--accent)]" />
            {stay.location}
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-[var(--border)] pt-4">
          <div>
            <p className="text-[10px] font-bold tracking-widest text-[var(--text)] uppercase opacity-40">
              Per Night
            </p>
            <p className="text-xl font-black text-[var(--accent)]">{formatCurrency(stay.price)}</p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--border)] text-[var(--text-h)] transition-all duration-300 group-hover:border-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-white group-hover:shadow-lg group-hover:shadow-purple-400/30">
            <ChevronRight size={20} strokeWidth={3} />
          </div>
        </div>
      </div>
    </Link>
  )
}
