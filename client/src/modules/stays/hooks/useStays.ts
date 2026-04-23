import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { type StaysQueryParams, staysService } from '../services/api'
import type { PaginatedResponse, Stay } from '../types'

export const useStays = (
  params: StaysQueryParams = {},
  options?: Partial<UseQueryOptions<PaginatedResponse<Stay>>>,
) => {
  return useQuery({
    queryKey: ['stays', params],
    queryFn: () => staysService.getAll(params),
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData,
    ...options,
  })
}
