import { http } from "@/core/services/http";
import { formatCurrency, formatDate } from "@/core/utils/formatters";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import type { Booking } from "../models"; // Import the interface

export const MyBookingsView: React.FC = () => {
  const { data: allBookings, isLoading } = useQuery<Booking[]>({
    queryKey: ["bookings"],
    queryFn: () => http.get("/bookings"),
  });

  const savedIds: string[] = JSON.parse(
    localStorage.getItem("my_bookings") || "[]",
  );

  const myBookings = allBookings?.filter((b) => savedIds.includes(b.id)) || [];

  if (isLoading)
    return <div className="p-20 text-center">Loading your trips...</div>;

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">My Bookings</h1>

      {myBookings.length === 0 ? (
        <div className="text-center py-20 bg-[var(--code-bg)] rounded-3xl border border-[var(--border)]">
          <p className="text-[var(--text)] opacity-60">
            You haven't booked any stays yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {myBookings.map((booking) => (
            <div
              key={booking.id}
              className="flex gap-6 p-4 border border-[var(--border)] rounded-2xl bg-[var(--card-bg)] shadow-sm hover:shadow-md transition-shadow"
            >
              <img
                src={booking.stay.images[0]}
                className="w-32 h-32 object-cover rounded-xl"
                alt={booking.stay.name}
              />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg text-[var(--text-h)]">
                      {booking.stay.name}
                    </h3>
                    <p className="text-sm text-[var(--text)] opacity-70">
                      {booking.stay.location}
                    </p>
                  </div>
                  <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">
                    {booking.status}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-[var(--text)] opacity-50">Dates</p>
                    <p className="font-medium text-[var(--text-h)]">
                      {formatDate(booking.checkIn)} -{" "}
                      {formatDate(booking.checkOut)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[var(--text)] opacity-50">Total Paid</p>
                    <p className="font-bold text-[var(--accent)]">
                      {formatCurrency(booking.totalPrice)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};
