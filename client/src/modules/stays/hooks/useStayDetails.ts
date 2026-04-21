import { useQuery } from '@tanstack/react-query'
import { staysService } from '../services/api'

export const useStayDetails = (id: string) => {
  return useQuery({
    queryKey: ['stays', id],
    queryFn: () => staysService.getById(id),
    enabled: !!id, // Only run if ID exists
    staleTime: 5 * 60 * 1000,
  })
}
