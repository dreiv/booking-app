import React, { useState } from "react";
import { useAddReview } from "../hooks/useAddReview";

export const AddReviewForm: React.FC<{ stayId: string }> = ({ stayId }) => {
  const [form, setForm] = useState({ authorName: "", rating: 5, comment: "" });
  const { mutate, isPending } = useAddReview(stayId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(form, {
      onSuccess: () => setForm({ authorName: "", rating: 5, comment: "" }),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-2xl shadow-sm border border-[var(--border)] space-y-6"
    >
      <h3 className="font-bold text-xl text-[var(--text-h)] text-gray-700">
        Leave a review
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Your Name</label>
          <input
            required
            placeholder="e.g. Andrei"
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--accent)] outline-none text-gray-900"
            value={form.authorName}
            onChange={(e) => setForm({ ...form, authorName: e.target.value })}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Rating</label>
          <select
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--accent)] outline-none bg-white text-gray-900"
            value={form.rating}
            onChange={(e) =>
              setForm({ ...form, rating: Number(e.target.value) })
            }
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n} Stars
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Comment</label>
        <textarea
          required
          placeholder="Describe your experience..."
          className="w-full p-3 border border-gray-300 rounded-lg h-32 focus:ring-2 focus:ring-[var(--accent)] outline-none text-gray-900"
          value={form.comment}
          onChange={(e) => setForm({ ...form, comment: e.target.value })}
        />
      </div>

      <button
        disabled={isPending}
        className="w-full md:w-auto bg-[var(--accent)] text-white px-8 py-3 rounded-xl font-bold hover:brightness-110 transition-all disabled:opacity-50 shadow-md shadow-purple-100"
      >
        {isPending ? "Posting..." : "Post Review"}
      </button>
    </form>
  );
};
