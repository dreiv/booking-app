import { http } from '@/core/services/http'
import { formatCurrency, formatDate } from '@/core/utils/formatters'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import type { Booking } from '../types' // Import the interface

export const MyBookingsView: React.FC = () => {
  const { data: allBookings, isLoading } = useQuery<Booking[]>({
    queryKey: ['bookings'],
    queryFn: () => http.get('/bookings'),
  })

  const savedIds: string[] = JSON.parse(localStorage.getItem('my_bookings') || '[]')

  const myBookings = allBookings?.filter((b) => savedIds.includes(b.id)) || []

  if (isLoading) return <div className="p-20 text-center">Loading your trips...</div>

  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="mb-8 text-3xl font-bold">My Bookings</h1>

      {myBookings.length === 0 ? (
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--code-bg)] py-20 text-center">
          <p className="text-[var(--text)] opacity-60">You haven't booked any stays yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {myBookings.map((booking) => (
            <div
              key={booking.id}
              className="flex gap-6 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <img
                src={booking.stay.images[0]}
                className="h-32 w-32 rounded-xl object-cover"
                alt={booking.stay.name}
              />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-[var(--text-h)]">{booking.stay.name}</h3>
                    <p className="text-sm text-[var(--text)] opacity-70">{booking.stay.location}</p>
                  </div>
                  <span className="rounded bg-green-100 px-2 py-1 text-xs font-bold text-green-700">
                    {booking.status}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-[var(--text)] opacity-50">Dates</p>
                    <p className="font-medium text-[var(--text-h)]">
                      {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[var(--text)] opacity-50">Total Paid</p>
                    <p className="font-bold text-[var(--accent)]">
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
