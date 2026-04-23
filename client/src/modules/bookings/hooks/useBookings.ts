import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface BookingState {
  bookedStayIds: string[]
  addBooking: (id: string) => void
  clearBookings: () => void
  isBooked: (id: string) => boolean
}

export const useBookings = create<BookingState>()(
  persist(
    (set, get) => ({
      bookedStayIds: [],

      addBooking: (id: string) => {
        const currentIds = get().bookedStayIds
        if (!currentIds.includes(id)) {
          set({ bookedStayIds: [...currentIds, id] })
        }
      },

      clearBookings: () => set({ bookedStayIds: [] }),

      isBooked: (id: string) => get().bookedStayIds.includes(id),
    }),
    { name: 'stay-easy-bookings' },
  ),
)
