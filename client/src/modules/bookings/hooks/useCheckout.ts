import { http } from '@/core/services/http'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { useBookings } from '../hooks/useBookings'
import type { BookingPayload, BookingResponse } from '../types'

export const useCheckout = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { addBooking } = useBookings()

  return useMutation<BookingResponse, Error, BookingPayload>({
    mutationFn: (bookingData: BookingPayload) =>
      http.post<BookingResponse>('/bookings', bookingData),
    onSuccess: (_data, variables) => {
      addBooking(variables.stayId)

      queryClient.invalidateQueries({ queryKey: ['stays'] })
      navigate('/bookings')
    },
  })
}
