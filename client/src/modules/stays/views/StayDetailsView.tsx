import { formatCurrency } from '@/core/utils/formatters'
import React from 'react'
import { useNavigate, useParams } from 'react-router'
import { useStayDetails } from '../hooks/useStayDetails'

import { AddReviewForm } from '@/modules/reviews/components/AddReviewForm'
import { ReviewList } from '@/modules/reviews/components/ReviewList'

export const StayDetailsView: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: stay, isLoading, isError } = useStayDetails(id!)

  if (isLoading) return <div className="p-20 text-center text-xl">Loading stay details...</div>
  if (isError || !stay) return <div className="p-20 text-center text-red-500">Stay not found.</div>

  return (
    <main className="mx-auto max-w-6xl p-4 lg:p-8">
      <header className="mb-6">
        <h1 className="mb-2 text-3xl font-bold">{stay.name}</h1>
        <p className="flex items-center gap-2 text-gray-600">
          <span className="i-lucide-map-pin" /> {stay.location}
        </p>
      </header>

      <section className="mb-8 grid grid-cols-1 gap-4 overflow-hidden rounded-2xl shadow-lg md:grid-cols-2">
        <div className="h-96">
          <img src={stay.images[0]} alt={stay.name} className="h-full w-full object-cover" />
        </div>
        <div className="grid h-96 grid-cols-2 gap-4">
          {stay.images.slice(1, 5).map((img, i) => (
            <img key={i} src={img} alt="" className="h-full w-full object-cover" />
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-4 text-2xl font-semibold">About this place</h2>
          <p className="mb-8 leading-relaxed whitespace-pre-line text-gray-700">
            {stay.description}
          </p>

          <hr className="my-8 border-gray-200" />

          <section id="reviews" className="mt-12 space-y-12">
            <div className="border-t pt-12">
              <h2 className="mb-8 text-2xl font-semibold">Guest Reviews</h2>
              <ReviewList reviews={stay.reviews} stayId={stay.id} />
            </div>

            <div className="max-w-xl">
              <AddReviewForm stayId={stay.id} />
            </div>
          </section>
        </div>

        <aside className="lg:col-span-1">
          <div className="sticky top-24 rounded-xl border bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <span className="text-2xl font-bold">{formatCurrency(stay.price)}</span>
              <span className="text-gray-500">/ night</span>
            </div>

            <button
              onClick={() => navigate(`/checkout/${stay.id}`)}
              className="w-full rounded-xl bg-[var(--accent)] py-4 text-lg font-bold text-white shadow-md shadow-purple-200 transition-all hover:brightness-110"
            >
              Reserve Now
            </button>

            <p className="mt-4 text-center text-xs text-gray-400">You won't be charged yet</p>
          </div>
        </aside>
      </div>
    </main>
  )
}
