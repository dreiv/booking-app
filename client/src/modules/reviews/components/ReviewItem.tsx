import { formatDate } from '@/core/utils/formatters'
import React from 'react'
import { type Review } from '../models'

interface Props {
  review: Review
}

export const ReviewItem: React.FC<Props> = ({ review }) => {
  return (
    <div className="border-b py-6 last:border-0">
      <div className="mb-2 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent)] font-bold text-white">
          {review.authorName[0].toUpperCase()}
        </div>
        <div>
          <h4 className="font-semibold text-[var(--text-h)]">{review.authorName}</h4>
          <p className="text-xs text-gray-400">{formatDate(review.createdAt)}</p>
        </div>
        <div className="ml-auto flex items-center gap-1 font-bold text-yellow-500">
          ★ {review.rating}
        </div>
      </div>
      <p className="text-gray-600 italic">"{review.comment}"</p>
    </div>
  )
}
