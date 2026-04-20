import { formatCurrency } from "@/core/utils/formatters";
import React from "react";
import { useNavigate, useParams } from "react-router";
import { useStayDetails } from "../hooks/useStayDetails";

import { AddReviewForm } from "@/modules/reviews/components/AddReviewForm";
import { ReviewList } from "@/modules/reviews/components/ReviewList";

export const StayDetailsView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: stay, isLoading, isError } = useStayDetails(id!);

  if (isLoading)
    return (
      <div className="p-20 text-center text-xl">Loading stay details...</div>
    );
  if (isError || !stay)
    return <div className="p-20 text-center text-red-500">Stay not found.</div>;

  return (
    <main className="max-w-6xl mx-auto p-4 lg:p-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{stay.name}</h1>
        <p className="text-gray-600 flex items-center gap-2">
          <span className="i-lucide-map-pin" /> {stay.location}
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 rounded-2xl overflow-hidden shadow-lg">
        <div className="h-96">
          <img
            src={stay.images[0]}
            alt={stay.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="grid grid-cols-2 gap-4 h-96">
          {stay.images.slice(1, 5).map((img, i) => (
            <img
              key={i}
              src={img}
              alt=""
              className="w-full h-full object-cover"
            />
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-semibold mb-4">About this place</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line mb-8">
            {stay.description}
          </p>

          <hr className="my-8 border-gray-200" />

          <section id="reviews" className="mt-12 space-y-12">
            <div className="border-t pt-12">
              <h2 className="text-2xl font-semibold mb-8">Guest Reviews</h2>
              <ReviewList reviews={stay.reviews} stayId={stay.id} />
            </div>

            <div className="max-w-xl">
              <AddReviewForm stayId={stay.id} />
            </div>
          </section>
        </div>

        <aside className="lg:col-span-1">
          <div className="sticky top-24 border rounded-xl p-6 shadow-xl bg-white">
            <div className="flex justify-between items-center mb-6">
              <span className="text-2xl font-bold">
                {formatCurrency(stay.price)}
              </span>
              <span className="text-gray-500">/ night</span>
            </div>

            <button
              onClick={() => navigate(`/checkout/${stay.id}`)}
              className="w-full bg-[var(--accent)] text-white py-4 rounded-xl font-bold text-lg hover:brightness-110 transition-all shadow-md shadow-purple-200"
            >
              Reserve Now
            </button>

            <p className="text-center text-xs text-gray-400 mt-4">
              You won't be charged yet
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
};
