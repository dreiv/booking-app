import { formatCurrency } from '@/core/utils/formatters'
import { FavoriteButton } from '@/modules/favorites/components/FavoriteButton'
import { CalendarX, CreditCard, MapPin, Star } from 'lucide-react'
import React from 'react'
import { Link, useNavigate } from 'react-router'
import type { Stay } from '../types'

interface Props {
  stay: Stay
  variant?: 'default' | 'compact'
}

export const StayCard: React.FC<Props> = ({ stay, variant = 'default' }) => {
  const navigate = useNavigate()
  const isCompact = variant === 'compact'
  const hasMultipleImages = stay.images && stay.images.length > 1
  const isBooked = stay._count && stay._count.bookings > 0

  const handleQuickBook = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isBooked) return
    navigate(`/checkout/${stay.id}`)
  }

  return (
    <Link
      to={`/stays/${stay.id}`}
      data-testid="stay-card"
      className={`group flex overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card-bg,transparent)] transition-all duration-500 ${
        isCompact ? 'h-40 flex-row' : 'flex-col'
      } ${
        isBooked
          ? 'opacity-80 grayscale-[0.3]'
          : 'hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10'
      }`}
    >
      <div
        className={`relative flex-shrink-0 overflow-hidden bg-[var(--border)] ${
          isCompact ? 'h-full w-40' : 'aspect-[4/3] w-full'
        }`}
      >
        {isBooked && (
          <div className="absolute top-2 left-2 z-20 flex items-center gap-1 rounded-full bg-gray-900/80 px-2 py-1 text-[8px] font-black tracking-widest text-white uppercase backdrop-blur-md">
            <CalendarX size={10} strokeWidth={3} />
            Booked
          </div>
        )}

        {stay.images?.[0] ? (
          <>
            <img
              src={stay.images[0]}
              alt={stay.name}
              className={`h-full w-full object-cover transition-all duration-700 group-hover:scale-110 ${
                hasMultipleImages && !isBooked ? 'group-hover:opacity-0' : ''
              }`}
            />
            {hasMultipleImages && !isBooked && (
              <img
                src={stay.images[1]}
                alt={`${stay.name} alternate view`}
                className="absolute inset-0 h-full w-full scale-105 object-cover opacity-0 transition-all duration-700 group-hover:scale-110 group-hover:opacity-100"
              />
            )}
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-[var(--text-muted)]">
            No Image
          </div>
        )}

        <div className="absolute top-2 right-2 z-10">
          <FavoriteButton
            stayId={stay.id}
            className="rounded-full bg-white/90 p-1.5 shadow-sm backdrop-blur-sm transition-transform hover:scale-110"
            iconSize={14}
          />
        </div>
      </div>

      <div className={`flex flex-grow flex-col ${isCompact ? 'min-w-0 p-3' : 'p-5'}`}>
        <div className={isCompact ? 'mb-1' : 'mb-4'}>
          <h3
            className={`${isCompact ? 'text-sm' : 'text-lg'} leading-tight font-black text-[var(--text-h)] transition-colors group-hover:text-[var(--accent)]`}
          >
            <span className="line-clamp-2">{stay.name}</span>
          </h3>

          <div className={`flex items-center justify-between ${isCompact ? 'mt-1' : 'mt-2'}`}>
            <p className="flex items-center gap-1 truncate text-[10px] font-medium text-[var(--text)] opacity-60 sm:text-xs">
              <MapPin size={isCompact ? 12 : 14} className="shrink-0 text-[var(--accent)]" />
              <span className="truncate">{stay.location}</span>
            </p>

            {stay.rating > 0 && (
              <div className="flex shrink-0 items-center gap-1">
                <Star size={12} className="fill-yellow-400 text-yellow-400" />
                <span
                  className={`${isCompact ? 'text-xs' : 'text-sm'} font-bold text-[var(--text-h)]`}
                >
                  {stay.rating.toFixed(1)}
                </span>
              </div>
            )}
          </div>
        </div>

        <div
          className={`mt-auto flex items-center justify-between border-t border-[var(--border)] ${isCompact ? 'pt-2' : 'pt-4'}`}
        >
          <div>
            {!isCompact && (
              <p className="text-[8px] font-bold tracking-widest text-[var(--text)] uppercase opacity-40">
                Per Night
              </p>
            )}
            <p className={`${isCompact ? 'text-base' : 'text-xl'} font-black text-[var(--accent)]`}>
              {formatCurrency(stay.price)}
              {isCompact && <span className="ml-1 text-[10px] font-bold opacity-40">/ night</span>}
            </p>
          </div>

          <button
            onClick={handleQuickBook}
            disabled={isBooked}
            aria-label={isBooked ? 'Unavailable' : 'Book'}
            className={`flex items-center justify-center rounded-xl transition-all ${
              isCompact ? 'h-8 w-8 px-0' : 'h-11 gap-2 px-4'
            } ${
              isBooked
                ? 'bg-gray-100 text-gray-400'
                : 'bg-[var(--accent)] text-white hover:shadow-lg active:scale-95'
            }`}
          >
            {isCompact ? (
              <CreditCard size={14} />
            ) : (
              <>
                <span className="text-sm">{isBooked ? 'Unavailable' : 'Book'}</span>
                {!isBooked && <CreditCard size={18} />}
              </>
            )}
          </button>
        </div>
      </div>
    </Link>
  )
}
