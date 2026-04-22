import { formatCurrency } from '@/core/utils/formatters'
import { ArrowLeft, MapPin } from 'lucide-react'
import React, { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { useStayDetails } from '../hooks/useStayDetails'

import { ImageLightbox } from '@/core/components/ImageLightbox'
import { AddReviewForm } from '@/modules/reviews/components/AddReviewForm'
import { ReviewList } from '@/modules/reviews/components/ReviewList'

export const StayDetailsView: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: stay, isLoading, isError } = useStayDetails(id!)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  if (isLoading)
    return <div className="animate-pulse p-20 text-center text-xl">Loading stay...</div>
  if (isError || !stay)
    return <div className="p-20 text-center font-bold text-red-500">Stay not found.</div>

  const images = stay.images || []
  const secondaryImages = images.slice(1, 5)

  const showNext = () => setLightboxIndex((i) => (i! + 1) % images.length)
  const showPrev = () => setLightboxIndex((i) => (i! - 1 + images.length) % images.length)

  return (
    <main className="mx-auto max-w-6xl p-4 lg:p-8">
      {lightboxIndex !== null && (
        <ImageLightbox
          images={images}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNext={showNext}
          onPrev={showPrev}
        />
      )}

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

      {/* REFINED GALLERY GRID */}
      <section className="mb-8 grid grid-cols-1 gap-4 overflow-hidden rounded-3xl shadow-lg md:grid-cols-3">
        {/* Main Featured Image */}
        <div className="h-[30rem] overflow-hidden md:col-span-2">
          <button
            onClick={() => setLightboxIndex(0)}
            className="h-full w-full cursor-zoom-in focus:outline-none"
          >
            <img
              src={images[0]}
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              alt={stay.name}
            />
          </button>
        </div>

        {/* Adaptive Secondary Grid */}
        <div
          className={`hidden h-[30rem] gap-4 md:grid ${
            secondaryImages.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
          }`}
        >
          {secondaryImages.map((img, i) => {
            // If we have exactly 3 secondary images (4 total),
            // make the last one span both columns to avoid a hole.
            const isLastOfThree = secondaryImages.length === 3 && i === 2

            return (
              <button
                key={i}
                onClick={() => setLightboxIndex(i + 1)}
                className={`h-full w-full cursor-zoom-in overflow-hidden focus:outline-none ${
                  isLastOfThree ? 'col-span-2' : ''
                }`}
              >
                <img
                  src={img}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                  alt="detail"
                />
              </button>
            )
          })}
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
          <div className="sticky top-24 rounded-3xl border border-[var(--border)] bg-white p-8 shadow-2xl shadow-purple-100/50">
            <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2">
              <span className="text-3xl font-black whitespace-nowrap text-[var(--accent)]">
                {formatCurrency(stay.price)}
              </span>
              <span className="whitespace-nowrap text-[var(--text)] opacity-60">/ night</span>
            </div>
            <button
              onClick={() => navigate(`/checkout/${stay.id}`)}
              className="w-full rounded-xl bg-[var(--accent)] py-4 text-lg font-bold text-white shadow-lg shadow-purple-200 transition-all hover:brightness-110 active:scale-[0.98]"
            >
              Reserve Now
            </button>
            <div className="mt-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 italic underline">Service fee</span>
                <span>{formatCurrency(0)}</span>
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
