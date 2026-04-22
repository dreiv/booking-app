import { formatCurrency } from '@/core/utils/formatters'
import { ArrowLeft, MapPin } from 'lucide-react'
import React from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { useStayDetails } from '../hooks/useStayDetails'

import { AddReviewForm } from '@/modules/reviews/components/AddReviewForm'
import { ReviewList } from '@/modules/reviews/components/ReviewList'

export const StayDetailsView: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: stay, isLoading, isError } = useStayDetails(id!)

  if (isLoading)
    return <div className="animate-pulse p-20 text-center text-xl">Loading stay details...</div>
  if (isError || !stay)
    return <div className="p-20 text-center font-bold text-red-500">Stay not found.</div>

  const hasSecondaryImages = stay.images && stay.images.length > 1

  return (
    <main className="mx-auto max-w-6xl p-4 lg:p-8">
      <nav className="mb-6">
        <Link
          to="/"
          className="flex items-center gap-2 text-sm font-bold text-[var(--accent)] hover:underline"
        >
          <ArrowLeft size={18} strokeWidth={2.5} />
          Back to all stays
        </Link>
      </nav>

      <header className="mb-6">
        <h1 className="mb-2 text-3xl font-black text-[var(--text-h)]">{stay.name}</h1>
        <p className="flex items-center gap-2 text-[var(--text)] opacity-70">
          <MapPin size={16} /> {stay.location}
        </p>
      </header>

      <section className="mb-8 grid grid-cols-1 gap-4 overflow-hidden rounded-2xl shadow-lg md:grid-cols-3">
        <div className="h-[30rem] md:col-span-2">
          <img
            src={stay.images?.[0] || '/placeholder-stay.jpg'}
            alt={stay.name}
            className="h-full w-full object-cover transition-opacity hover:opacity-95"
          />
        </div>

        <div className="hidden h-[30rem] grid-cols-2 gap-4 md:grid">
          {hasSecondaryImages ? (
            stay.images
              .slice(1, 5)
              .map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`${stay.name} detail ${i + 1}`}
                  className="h-full w-full object-cover transition-opacity hover:opacity-90"
                />
              ))
          ) : (
            <div className="col-span-2 flex items-center justify-center bg-gray-100 text-gray-400">
              No more photos
            </div>
          )}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <section>
            <h2 className="mb-4 text-2xl font-bold text-[var(--text-h)]">About this place</h2>
            <p className="mb-8 leading-relaxed whitespace-pre-line text-[var(--text)] opacity-90">
              {stay.description}
            </p>
          </section>

          <hr className="my-12 border-[var(--border)]" />

          <section id="reviews" className="space-y-12">
            <div>
              <h2 className="mb-8 text-2xl font-bold text-[var(--text-h)]">Guest Reviews</h2>
              <ReviewList reviews={stay.reviews} stayId={stay.id} />
            </div>

            <div className="max-w-xl rounded-2xl bg-gray-50/50 p-2">
              <AddReviewForm stayId={stay.id} />
            </div>
          </section>
        </div>

        <aside className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-[var(--border)] bg-white p-8 shadow-2xl shadow-purple-100/50">
            <div className="mb-6 flex items-baseline justify-between">
              <span className="text-3xl font-black text-[var(--accent)]">
                {formatCurrency(stay.price)}
              </span>
              <span className="text-[var(--text)] opacity-60">/ night</span>
            </div>

            <button
              onClick={() => navigate(`/checkout/${stay.id}`)}
              className="w-full rounded-xl bg-[var(--accent)] py-4 text-lg font-bold text-white shadow-lg shadow-purple-200 transition-all hover:scale-[1.02] hover:brightness-110 active:scale-[0.98]"
            >
              Reserve Now
            </button>

            <div className="mt-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 italic underline">Service fee</span>
                <span className="text-gray-500">{formatCurrency(0)}</span>
              </div>
              <hr className="border-[var(--border)]" />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>{formatCurrency(stay.price)}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  )
}
