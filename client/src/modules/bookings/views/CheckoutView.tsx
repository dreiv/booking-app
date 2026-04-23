import { formatCurrency } from '@/core/utils/formatters'
import { Calendar, Info, MapPin, Star } from 'lucide-react'
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

  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center" data-testid="loading-spinner">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--accent)] border-t-transparent" />
      </div>
    )

  if (!stay) return <Navigate to="/" />

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutate({
      ...form,
      stayId: stay.id,
      totalPrice: stay.price,
      checkIn: new Date().toISOString(),
      checkOut: new Date(Date.now() + 86400000).toISOString(),
    })
  }

  return (
    <main className="container-root px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-10 text-4xl font-black tracking-tight text-[var(--text-h)]">
          Confirm and Pay
        </h1>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
          <section className="space-y-8 lg:col-span-3">
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--bg)] p-8">
              <h2 className="mb-6 text-xl font-bold text-[var(--text-h)]">Your Information</h2>
              <form id="checkout-form" onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="ml-1 text-sm font-bold text-[var(--text)] opacity-70">
                    Full Name
                  </label>
                  <input
                    required
                    placeholder="e.g. John Doe"
                    className="w-full rounded-2xl border border-[var(--border)] bg-[var(--accent-bg)] p-4 transition-all outline-none focus:border-[var(--accent)]"
                    value={form.guestName}
                    onChange={(e) => setForm({ ...form, guestName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="ml-1 text-sm font-bold text-[var(--text)] opacity-70">
                    Email Address
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="john@example.com"
                    className="w-full rounded-2xl border border-[var(--border)] bg-[var(--accent-bg)] p-4 transition-all outline-none focus:border-[var(--accent)]"
                    value={form.guestEmail}
                    onChange={(e) => setForm({ ...form, guestEmail: e.target.value })}
                  />
                </div>
              </form>
            </div>

            <button
              form="checkout-form"
              disabled={isPending}
              className="group relative w-full overflow-hidden rounded-2xl bg-[var(--accent)] py-5 text-xl font-black text-white transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
            >
              <span className="relative z-10">
                {isPending ? 'Processing...' : `Confirm Booking • ${formatCurrency(stay.price)}`}
              </span>
            </button>
          </section>

          <aside className="lg:col-span-2">
            <div className="sticky top-24 rounded-3xl border border-[var(--border)] bg-[var(--bg)] p-2 shadow-xl">
              <div className="p-6">
                <div className="mb-6 flex gap-4">
                  <img
                    src={stay.images[0]}
                    className="h-24 w-24 rounded-2xl object-cover shadow-md"
                    alt=""
                  />
                  <div className="flex flex-col justify-center">
                    <div className="mb-1 flex items-center gap-1 text-[10px] font-black text-[var(--accent)] uppercase">
                      <MapPin size={10} /> {stay.location.split(',')[0]}
                    </div>
                    <h3 className="font-black text-[var(--text-h)]">{stay.name}</h3>
                    {stay.rating > 0 && (
                      <div className="mt-1 flex items-center gap-1">
                        <Star size={12} className="fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-bold">{stay.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-6 flex items-center gap-3 rounded-2xl bg-[var(--accent-bg)] p-4 text-sm">
                  <Calendar size={16} className="text-[var(--accent)]" />
                  <span className="font-medium">1 Night Trip • Tomorrow</span>
                </div>

                <div className="space-y-3 border-t border-[var(--border)] pt-6">
                  <div className="flex justify-between text-sm">
                    <span className="opacity-60">Total (RON)</span>
                    <span className="text-2xl font-black text-[var(--accent)]">
                      {formatCurrency(stay.price)}
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex gap-2 rounded-xl bg-orange-50 p-3 text-[11px] text-orange-800 dark:bg-orange-900/10 dark:text-orange-300">
                  <Info size={14} className="shrink-0" />
                  <span>Free cancellation for 24h. Local taxes included.</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
