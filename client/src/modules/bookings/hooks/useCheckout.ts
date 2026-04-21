import { http } from '@/core/services/http'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import type { BookingPayload, BookingResponse } from '../models'

export const useCheckout = () => {
  const navigate = useNavigate()

  return useMutation<BookingResponse, Error, BookingPayload>({
    mutationFn: (data: BookingPayload) => http.post('/bookings', data),

    onSuccess: (data) => {
      const existing = JSON.parse(localStorage.getItem('my_bookings') || '[]')

      localStorage.setItem('my_bookings', JSON.stringify([...existing, data.booking.id]))

      alert('Booking Successful!')
      navigate('/my-bookings')
    },
  })
}
