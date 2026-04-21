import React from 'react'
import { type Review } from '../models'
import { ReviewItem } from './ReviewItem'

interface Props {
  reviews?: Review[]
  stayId: string
}

export const ReviewList: React.FC<Props> = ({ reviews = [] }) => {
  if (reviews.length === 0) {
    return (
      <div className="rounded-xl bg-gray-50 p-8 text-center">
        <p className="text-gray-500">No reviews yet. Be the first to share your experience!</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="mb-6 flex items-center gap-4">
        <span className="text-4xl font-bold">
          {(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)}
        </span>
        <div>
          <p className="font-bold">Average Rating</p>
          <p className="text-sm text-gray-500">{reviews.length} total reviews</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-x-12 gap-y-4 md:grid-cols-2">
        {reviews.map((review) => (
          <ReviewItem key={review.id} review={review} />
        ))}
      </div>
    </div>
  )
}
