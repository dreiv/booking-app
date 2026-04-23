import { formatCurrency } from '@/core/utils/formatters'
import { ArrowLeft, CalendarX, Info, MapPin } from 'lucide-react'
import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useStayDetails } from '../hooks/useStayDetails'

import { ImageLightbox } from '@/core/components/ImageLightbox'
import { FavoriteButton } from '@/modules/favorites/components/FavoriteButton'
import { AddReviewForm } from '@/modules/reviews/components/AddReviewForm'
import { ReviewList } from '@/modules/reviews/components/ReviewList'

export const StayDetailsView: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: stay, isLoading, isError } = useStayDetails(id!)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  if (isLoading)
    return <div className="animate-pulse p-20 text-center text-xl font-medium">Loading stay...</div>
  if (isError || !stay)
    return <div className="p-20 text-center font-bold text-red-500">Stay not found.</div>

  const isBooked = stay._count && stay._count.bookings > 0
  const images = stay.images || []
  const secondaryImages = images.slice(1, 5)

  const showNext = () => setLightboxIndex((i) => (i! + 1) % images.length)
  const showPrev = () => setLightboxIndex((i) => (i! - 1 + images.length) % images.length)

  const handleBack = () => {
    // Navigate -1 goes back in history (stays in Favorites if they came from there)
    navigate(-1)
  }

  const handleReserve = () => {
    if (isBooked) return
    navigate(`/checkout/${stay.id}`)
  }

  return (
    <main className={`mx-auto max-w-6xl p-4 lg:p-8 ${isBooked ? 'opacity-90' : ''}`}>
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
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-sm font-bold text-[var(--accent)] transition-all hover:translate-x-[-4px] hover:underline"
        >
          <ArrowLeft size={18} strokeWidth={2.5} />
          Back
        </button>
      </nav>

      <header className="mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="flex items-center gap-2 text-3xl font-black text-[var(--text-h)]">
            {stay.name}
            <FavoriteButton stayId={stay.id} />
          </h1>
          {isBooked && (
            <span className="flex items-center gap-1.5 rounded-full bg-gray-900 px-3 py-1 text-[10px] font-black tracking-widest text-white uppercase">
              <CalendarX size={14} /> Already Booked
            </span>
          )}
        </div>
        <p className="mt-2 flex items-center gap-2 text-[var(--text)] opacity-70">
          <MapPin size={16} /> {stay.location}
        </p>
      </header>

      <section
        className={`mb-8 grid grid-cols-1 gap-4 overflow-hidden rounded-3xl shadow-lg md:grid-cols-3 ${isBooked ? 'grayscale-[0.4]' : ''}`}
      >
        <div className="h-[30rem] overflow-hidden md:col-span-2">
          <button
            onClick={() => setLightboxIndex(0)}
            aria-label={`View ${stay.name} gallery`}
            className="h-full w-full cursor-zoom-in focus:outline-none"
          >
            <img
              src={images[0]}
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              alt={stay.name}
            />
          </button>
        </div>

        <div
          className={`hidden h-[30rem] gap-4 md:grid ${secondaryImages.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}
        >
          {secondaryImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setLightboxIndex(i + 1)}
              className={`h-full w-full cursor-zoom-in overflow-hidden focus:outline-none ${secondaryImages.length === 3 && i === 2 ? 'col-span-2' : ''}`}
            >
              <img
                src={img}
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                alt="detail"
              />
            </button>
          ))}
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
            <ReviewList reviews={stay.reviews} stayId={stay.id} />
            <AddReviewForm stayId={stay.id} />
          </section>
        </div>

        <aside className="lg:col-span-1">
          <div className="sticky top-24 rounded-3xl border border-[var(--border)] bg-white p-8 shadow-2xl">
            <div className="mb-6 flex items-baseline justify-between">
              <span className="text-3xl font-black text-[var(--accent)]">
                {formatCurrency(stay.price)}
              </span>
              <span className="opacity-60">/ night</span>
            </div>

            {isBooked && (
              <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-800">
                <Info size={20} className="shrink-0" />
                <p>This property is currently unavailable for the selected dates.</p>
              </div>
            )}

            <button
              onClick={handleReserve}
              disabled={isBooked}
              className={`w-full rounded-xl py-4 text-lg font-bold text-white transition-all ${
                isBooked
                  ? 'pointer-events-none cursor-not-allowed bg-gray-400'
                  : 'bg-[var(--accent)] hover:brightness-110'
              }`}
            >
              {isBooked ? 'Unavailable' : 'Reserve Now'}
            </button>
          </div>
        </aside>
      </div>
    </main>
  )
}
