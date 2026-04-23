import { staysService } from '@/modules/stays/services/api'
import { useQuery } from '@tanstack/react-query'
import { useBookings } from './useBookings'

export const useBookedStays = () => {
  const { bookedStayIds } = useBookings()

  return useQuery({
    queryKey: ['stays', 'booked', bookedStayIds],
    queryFn: async () => {
      if (bookedStayIds.length === 0) return []

      const response = await staysService.getAll({
        ids: bookedStayIds,
        limit: 100,
      })

      return response.data
    },
    enabled: bookedStayIds.length > 0,
  })
}
