import { formatCurrency } from "@/core/utils/formatters";
import React, { useState } from "react";
import { Navigate, useParams } from "react-router";
import { useStayDetails } from "../../stays/hooks/useStayDetails";
import { useCheckout } from "../hooks/useCheckout";

export const CheckoutView: React.FC = () => {
  const { stayId } = useParams<{ stayId: string }>();
  const { data: stay, isLoading } = useStayDetails(stayId!);
  const { mutate, isPending } = useCheckout();

  const [form, setForm] = useState({
    guestName: "",
    guestEmail: "",
  });

  if (isLoading)
    return <div className="p-20 text-center">Loading booking details...</div>;
  if (!stay) return <Navigate to="/" />;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({
      ...form,
      stayId: stay.id,
      totalPrice: stay.price, // Simplify: 1 night
      checkIn: new Date().toISOString(),
      checkOut: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    });
  };

  return (
    <main className="max-w-5xl mx-auto p-6 lg:p-12">
      <h1 className="text-3xl font-bold mb-8">Confirm and Pay</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Left: Guest Details Form */}
        <section className="space-y-8">
          <div className="border-b pb-8">
            <h2 className="text-xl font-semibold mb-4">Your Details</h2>
            <form
              id="checkout-form"
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <input
                required
                placeholder="Full Name"
                className="w-full p-4 border rounded-xl"
                value={form.guestName}
                onChange={(e) =>
                  setForm({ ...form, guestName: e.target.value })
                }
              />
              <input
                required
                type="email"
                placeholder="Email Address"
                className="w-full p-4 border rounded-xl"
                value={form.guestEmail}
                onChange={(e) =>
                  setForm({ ...form, guestEmail: e.target.value })
                }
              />
            </form>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Payment Policy</h2>
            <p className="text-gray-500 text-sm">
              This is a demo app. No actual payment will be processed. By
              clicking "Confirm Booking", you agree to the mock terms.
            </p>
          </div>

          <button
            form="checkout-form"
            disabled={isPending}
            className="w-full bg-[var(--accent)] text-white py-4 rounded-xl font-bold text-lg disabled:opacity-50"
          >
            {isPending ? "Processing..." : `Confirm Booking`}
          </button>
        </section>

        {/* Right: Stay Summary Card */}
        <aside>
          <div className="border rounded-2xl p-6 sticky top-24 shadow-sm bg-gray-50">
            <div className="flex gap-4 mb-6">
              <img
                src={stay.images[0]}
                className="w-24 h-24 object-cover rounded-lg"
                alt=""
              />
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">
                  {stay.location}
                </p>
                <h3 className="font-semibold">{stay.name}</h3>
              </div>
            </div>

            <hr className="my-6" />

            <h3 className="font-bold mb-4">Price Details</h3>
            <div className="flex justify-between mb-2">
              <span>1 night × {formatCurrency(stay.price)}</span>
              <span>{formatCurrency(stay.price)}</span>
            </div>

            <div className="flex justify-between border-t pt-4 mt-4 font-bold text-lg">
              <span>Total (RON)</span>
              <span>{formatCurrency(stay.price)}</span>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
};
