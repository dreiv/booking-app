import { formatCurrency } from '@/core/utils/formatters'
import { FavoriteButton } from '@/modules/favorites/components/FavoriteButton'
import { CalendarX, CreditCard, MapPin, Star } from 'lucide-react'
import React from 'react'
import { Link, useNavigate } from 'react-router'
import type { Stay } from '../types'

interface Props {
  stay: Stay
}

export const StayCard: React.FC<Props> = ({ stay }) => {
  const navigate = useNavigate()
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
      className={`group flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card-bg,transparent)] transition-all duration-500 ${
        isBooked
          ? 'opacity-80 grayscale-[0.3]'
          : 'hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/10'
      }`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--border)]">
        {isBooked && (
          <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 rounded-full bg-gray-900/80 px-3 py-1.5 text-[10px] font-black tracking-widest text-white uppercase shadow-xl backdrop-blur-md">
            <CalendarX size={12} strokeWidth={3} />
            Already Booked
          </div>
        )}

        {stay.images?.[0] ? (
          <>
            <img
              src={stay.images[0]}
              alt={stay.name}
              className={`h-full w-full object-cover transition-all duration-700 ease-in-out group-hover:scale-110 ${
                hasMultipleImages && !isBooked ? 'group-hover:opacity-0' : ''
              }`}
            />
            {hasMultipleImages && !isBooked && (
              <img
                src={stay.images[1]}
                alt={`${stay.name} alternate view`}
                className="absolute inset-0 h-full w-full scale-105 object-cover opacity-0 transition-all duration-700 ease-in-out group-hover:scale-110 group-hover:opacity-100"
              />
            )}
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[var(--text-muted)]">
            No Image Available
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/20 opacity-40 transition-opacity duration-500 group-hover:opacity-60" />

        <div className="absolute top-3 right-3 z-10">
          <FavoriteButton
            stayId={stay.id}
            className="rounded-full bg-white/80 p-2 backdrop-blur-sm transition-transform hover:scale-110 active:scale-90"
            iconSize={18}
          />
        </div>
      </div>

      <div className="flex flex-grow flex-col p-5">
        <div className="mb-4">
          <h3 className="text-lg leading-tight font-black text-[var(--text-h)] transition-colors group-hover:text-[var(--accent)]">
            <span className="line-clamp-2">{stay.name}</span>
          </h3>

          <div className="mt-2 flex items-center justify-between">
            <p className="flex items-center gap-1.5 text-sm font-medium text-[var(--text)] opacity-60">
              <MapPin size={14} className="text-[var(--accent)]" />
              {stay.location}
            </p>

            {stay.rating > 0 && (
              <div className="flex items-center gap-1">
                <Star size={14} className="fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-bold text-[var(--text-h)]">
                  {stay.rating.toFixed(1)}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-[var(--border)] pt-4">
          <div>
            <p className="text-[10px] font-bold tracking-widest text-[var(--text)] uppercase opacity-40">
              Per Night
            </p>
            <p className="text-xl font-black text-[var(--accent)]">{formatCurrency(stay.price)}</p>
          </div>

          <button
            onClick={handleQuickBook}
            disabled={isBooked}
            className={`flex h-11 items-center gap-2 rounded-xl px-4 font-bold transition-all ${
              isBooked
                ? 'cursor-not-allowed bg-gray-200 text-gray-500'
                : 'bg-[var(--accent)] text-white hover:shadow-lg hover:shadow-purple-400/30 hover:brightness-110 active:scale-95'
            }`}
          >
            <span className="text-sm">{isBooked ? 'Unavailable' : 'Book'}</span>
            {!isBooked && <CreditCard size={18} />}
          </button>
        </div>
      </div>
    </Link>
  )
}
