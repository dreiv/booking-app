import { http } from '@/core/services/http'
import type { PaginatedResponse, Stay } from '../models'

export interface StaysQueryParams {
  page?: number
  limit?: number
  location?: string
}

export const staysService = {
  getAll: (params: StaysQueryParams = {}) =>
    http.get<PaginatedResponse<Stay>>('/stays', params as Record<string, string>),

  getById: (id: string) => http.get<Stay>(`/stays/${id}`),
}
