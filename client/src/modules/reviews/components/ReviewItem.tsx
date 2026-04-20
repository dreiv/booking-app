import { formatDate } from "@/core/utils/formatters";
import React from "react";
import { type Review } from "../models";

interface Props {
  review: Review;
}

export const ReviewItem: React.FC<Props> = ({ review }) => {
  return (
    <div className="py-6 border-b last:border-0">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-full bg-[var(--accent)] text-white flex items-center justify-center font-bold">
          {review.authorName[0].toUpperCase()}
        </div>
        <div>
          <h4 className="font-semibold text-[var(--text-h)]">
            {review.authorName}
          </h4>
          <p className="text-xs text-gray-400">
            {formatDate(review.createdAt)}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-1 text-yellow-500 font-bold">
          ★ {review.rating}
        </div>
      </div>
      <p className="text-gray-600 italic">"{review.comment}"</p>
    </div>
  );
};
