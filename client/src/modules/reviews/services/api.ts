import { http } from '@/core/services/http'
import type { Review } from '../types'

export const reviewsService = {
  getByStayId: (stayId: string) => http.get<Review[]>(`/stays/${stayId}/reviews`),

  create: (stayId: string, data: Omit<Review, 'id' | 'createdAt'>) =>
    http.post<Review>(`/stays/${stayId}/reviews`, data),
}
