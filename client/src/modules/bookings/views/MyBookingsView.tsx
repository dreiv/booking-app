import { formatCurrency } from '@/core/utils/formatters'
import { MapPin, Star } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router'
import { useBookedStays } from '../hooks/useBookedStays'
import { useBookings } from '../hooks/useBookings'

export const MyBookingsView: React.FC = () => {
  const { bookedStayIds } = useBookings()
  const { data, isLoading } = useBookedStays()
  const stays = data || []

  if (isLoading && bookedStayIds.length > 0) {
    return <div className="animate-pulse p-20 text-center">Loading your trips...</div>
  }

  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="mb-8 text-4xl font-black text-[var(--text-h)]">My Bookings</h1>

      {bookedStayIds.length === 0 ? (
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--accent-bg)] py-20 text-center">
          <p className="text-xl font-bold text-[var(--text-h)]">No trips booked yet.</p>
          <p className="mt-2 text-[var(--text)] opacity-60">
            Your confirmed stays will appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {stays.map((stay) => (
            <Link
              key={stay.id}
              to={`/stays/${stay.id}`}
              className="group flex flex-col gap-6 rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-4 transition-all hover:shadow-xl sm:flex-row"
            >
              <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-xl sm:w-48">
                <img
                  src={stay.images[0]}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  alt={stay.name}
                />
              </div>

              <div className="flex flex-1 flex-col justify-between py-1">
                <div>
                  <div className="flex items-start justify-between">
                    <h3 className="text-xl font-black text-[var(--text-h)] transition-colors group-hover:text-[var(--accent)]">
                      {stay.name}
                    </h3>
                    {stay.rating > 0 && (
                      <div className="flex items-center gap-1 rounded-lg bg-yellow-400/10 px-2 py-1">
                        <Star size={14} className="fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-bold text-yellow-700">
                          {stay.rating.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>

                  <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-[var(--text)] opacity-60">
                    <MapPin size={14} className="text-[var(--accent)]" />
                    {stay.location}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-[var(--border)] pt-4">
                  <div>
                    <p className="text-[10px] font-bold tracking-widest text-[var(--text)] uppercase opacity-40">
                      Amount Paid
                    </p>
                    <p className="text-xl font-black text-[var(--accent)]">
                      {formatCurrency(stay.price)}
                    </p>
                  </div>

                  <span className="rounded-xl bg-green-500/10 px-4 py-2 text-xs font-bold text-green-600">
                    Confirmed
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
