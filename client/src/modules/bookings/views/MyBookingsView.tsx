import { formatCurrency, formatDate } from '@/core/utils/formatters'
import React, { useMemo } from 'react'
import { useBookings } from '../hooks/useBookings' // Extract logic to a hook

export const MyBookingsView: React.FC = () => {
  const { data: allBookings, isLoading } = useBookings()

  const myBookings = useMemo(() => {
    const savedIds: string[] = JSON.parse(localStorage.getItem('my_bookings') || '[]')
    return allBookings?.filter((b) => savedIds.includes(b.id)) || []
  }, [allBookings])

  if (isLoading) return <div className="animate-pulse p-20 text-center">Loading your trips...</div>

  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="mb-8 text-3xl font-bold text-[var(--text-h)]">My Bookings</h1>

      {myBookings.length === 0 ? (
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--accent-bg)] py-20 text-center">
          {/* Removed opacity, used explicit color variable for better contrast */}
          <p className="text-[var(--text)]">You haven't booked any stays yet.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {myBookings.map((booking) => (
            <div
              key={booking.id}
              className="shadow-soft flex flex-col gap-6 rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-5 transition-all hover:shadow-md sm:flex-row"
            >
              <img
                src={booking.stay.images[0]}
                className="h-32 w-full rounded-xl object-cover shadow-sm sm:w-32"
                alt=""
              />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-[var(--text-h)]">{booking.stay.name}</h3>
                    <p className="text-sm font-medium text-[var(--text)]">
                      {booking.stay.location}
                    </p>
                  </div>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    {booking.status}
                  </span>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-8 border-t border-[var(--border)] pt-4 text-sm">
                  <div>
                    <p className="text-xs font-bold tracking-wider text-[var(--text)] uppercase opacity-80">
                      Dates
                    </p>
                    <p className="mt-1 font-semibold text-[var(--text-h)]">
                      {formatDate(booking.checkIn)} – {formatDate(booking.checkOut)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold tracking-wider text-[var(--text)] uppercase opacity-80">
                      Total Paid
                    </p>
                    <p className="mt-1 text-lg font-bold text-[var(--accent)]">
                      {formatCurrency(booking.totalPrice)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
