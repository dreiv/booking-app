import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import React, { useCallback, useEffect } from 'react'

interface Props {
  images: string[]
  index: number
  onClose: () => void
  onNext: () => void
  onPrev: () => void
}

export const ImageLightbox: React.FC<Props> = ({ images, index, onClose, onNext, onPrev }) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNext()
      if (e.key === 'ArrowLeft') onPrev()
    },
    [onClose, onNext, onPrev],
  )

  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = originalStyle
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  if (!images.length) return null

  return (
    <div className="animate-in fade-in fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm duration-200">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-[110] text-white/70 transition-colors hover:text-white"
      >
        <X size={32} />
      </button>

      <div className="pointer-events-none absolute inset-x-4 z-[110] flex justify-between">
        <button
          onClick={onPrev}
          className="pointer-events-auto rounded-full bg-black/20 p-3 text-white transition-all hover:bg-black/40"
        >
          <ChevronLeft size={32} />
        </button>
        <button
          onClick={onNext}
          className="pointer-events-auto rounded-full bg-black/20 p-3 text-white transition-all hover:bg-black/40"
        >
          <ChevronRight size={32} />
        </button>
      </div>

      <div
        className="relative flex h-full w-full items-center justify-center"
        onClick={onClose}
        data-testid="lightbox-backdrop"
      >
        <img
          src={images[index]}
          alt={`View ${index + 1}`}
          className="max-h-full max-w-full rounded-lg object-contain shadow-2xl select-none"
          onClick={(e) => e.stopPropagation()}
        />
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-4 py-1 text-sm text-white">
          {index + 1} / {images.length}
        </div>
      </div>
    </div>
  )
}
