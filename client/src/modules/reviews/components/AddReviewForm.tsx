import React, { useState } from 'react'
import { useAddReview } from '../hooks/useAddReview'

export const AddReviewForm: React.FC<{ stayId: string }> = ({ stayId }) => {
  const [form, setForm] = useState({ authorName: '', rating: 5, comment: '' })
  const { mutate, isPending, error } = useAddReview(stayId)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutate(form, {
      onSuccess: () => setForm({ authorName: '', rating: 5, comment: '' }),
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-[var(--border)] bg-white p-8 shadow-sm"
    >
      <h3 className="text-xl font-bold text-gray-700">Leave a review</h3>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Your Name</label>
          <input
            required
            placeholder="e.g. Andrei"
            className="rounded-lg border border-gray-300 p-3 text-gray-900 outline-none focus:ring-2 focus:ring-[var(--accent)]"
            value={form.authorName}
            onChange={(e) => setForm({ ...form, authorName: e.target.value })}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Rating</label>
          <select
            className="rounded-lg border border-gray-300 bg-white p-3 text-gray-900 outline-none focus:ring-2 focus:ring-[var(--accent)]"
            value={form.rating}
            onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
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
          className="h-32 w-full rounded-lg border border-gray-300 p-3 text-gray-900 outline-none focus:ring-2 focus:ring-[var(--accent)]"
          value={form.comment}
          onChange={(e) => setForm({ ...form, comment: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <button
          disabled={isPending}
          className="w-full rounded-xl bg-[var(--accent)] px-8 py-3 font-bold text-white shadow-md shadow-purple-100 transition-all hover:brightness-110 disabled:opacity-50 md:w-auto"
        >
          {isPending ? 'Posting...' : 'Post Review'}
        </button>

        {error && (
          <p className="text-sm font-bold text-red-500">
            Could not post review. Please check for inappropriate language and try again.
          </p>
        )}
      </div>
    </form>
  )
}
