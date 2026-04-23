import type { Review } from '@/modules/reviews/types'

export interface Stay {
  id: string
  name: string
  description: string
  location: string
  latitude: number
  longitude: number
  price: number
  rating: number
  images: string[]
  reviews?: Review[]
  createdAt: string
  _count?: {
    bookings: number
  }
}

export interface PaginationMeta {
  totalCount: number
  page: number
  limit: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

export type StaySortOption = 'newest' | 'price_asc' | 'price_desc' | 'rating_desc'

export interface StaysQueryParams {
  location?: string
  minPrice?: number
  maxPrice?: number
  sort?: StaySortOption
  page?: number
  limit?: number
  ids?: string[]
}
