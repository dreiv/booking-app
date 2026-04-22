import { http } from '@/core/services/http'
import { useQuery } from '@tanstack/react-query'
import type { Booking } from '../types'

export const useBookings = () => {
  return useQuery<Booking[]>({
    queryKey: ['bookings'],
    queryFn: () => http.get('/bookings'),
    staleTime: 1000 * 60 * 5,
  })
}
