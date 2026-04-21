import { formatCurrency } from '@/core/utils/formatters'
import React, { useState } from 'react'
import { Navigate, useParams } from 'react-router'
import { useStayDetails } from '../../stays/hooks/useStayDetails'
import { useCheckout } from '../hooks/useCheckout'

export const CheckoutView: React.FC = () => {
  const { stayId } = useParams<{ stayId: string }>()
  const { data: stay, isLoading } = useStayDetails(stayId!)
  const { mutate, isPending } = useCheckout()

  const [form, setForm] = useState({
    guestName: '',
    guestEmail: '',
  })

  if (isLoading) return <div className="p-20 text-center">Loading booking details...</div>
  if (!stay) return <Navigate to="/" />

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutate({
      ...form,
      stayId: stay.id,
      totalPrice: stay.price, // Simplify: 1 night
      checkIn: new Date().toISOString(),
      checkOut: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    })
  }

  return (
    <main className="mx-auto max-w-5xl p-6 lg:p-12">
      <h1 className="mb-8 text-3xl font-bold">Confirm and Pay</h1>

      <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
        {/* Left: Guest Details Form */}
        <section className="space-y-8">
          <div className="border-b pb-8">
            <h2 className="mb-4 text-xl font-semibold">Your Details</h2>
            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
              <input
                required
                placeholder="Full Name"
                className="w-full rounded-xl border p-4"
                value={form.guestName}
                onChange={(e) => setForm({ ...form, guestName: e.target.value })}
              />
              <input
                required
                type="email"
                placeholder="Email Address"
                className="w-full rounded-xl border p-4"
                value={form.guestEmail}
                onChange={(e) => setForm({ ...form, guestEmail: e.target.value })}
              />
            </form>
          </div>

          <div>
            <h2 className="mb-4 text-xl font-semibold">Payment Policy</h2>
            <p className="text-sm text-gray-500">
              This is a demo app. No actual payment will be processed. By clicking "Confirm
              Booking", you agree to the mock terms.
            </p>
          </div>

          <button
            form="checkout-form"
            disabled={isPending}
            className="w-full rounded-xl bg-[var(--accent)] py-4 text-lg font-bold text-white disabled:opacity-50"
          >
            {isPending ? 'Processing...' : `Confirm Booking`}
          </button>
        </section>

        {/* Right: Stay Summary Card */}
        <aside>
          <div className="sticky top-24 rounded-2xl border bg-gray-50 p-6 shadow-sm">
            <div className="mb-6 flex gap-4">
              <img src={stay.images[0]} className="h-24 w-24 rounded-lg object-cover" alt="" />
              <div>
                <p className="text-xs font-bold tracking-wider text-gray-500 uppercase">
                  {stay.location}
                </p>
                <h3 className="font-semibold">{stay.name}</h3>
              </div>
            </div>

            <hr className="my-6" />

            <h3 className="mb-4 font-bold">Price Details</h3>
            <div className="mb-2 flex justify-between">
              <span>1 night × {formatCurrency(stay.price)}</span>
              <span>{formatCurrency(stay.price)}</span>
            </div>

            <div className="mt-4 flex justify-between border-t pt-4 text-lg font-bold">
              <span>Total (RON)</span>
              <span>{formatCurrency(stay.price)}</span>
            </div>
          </div>
        </aside>
      </div>
    </main>
  )
}
