import { http } from '@/core/services/http'
import type { PaginatedResponse, Stay } from '../types'

export interface StaysQueryParams {
  page?: number
  limit?: number
  location?: string
  ids?: string[]
  minPrice?: number
  maxPrice?: number
  sort?: 'price_asc' | 'price_desc' | 'rating_desc' | 'newest'
}

export const staysService = {
  getAll: (params: StaysQueryParams = {}) =>
    http.get<PaginatedResponse<Stay>>('/stays', params as Record<string, string>),

  getById: (id: string) => http.get<Stay>(`/stays/${id}`),
}
