import type { Review } from "@/modules/reviews/models";

export interface Stay {
  id: string;
  name: string;
  description: string;
  location: string;
  latitude: number;
  longitude: number;
  price: number;
  images: string[];
  reviews?: Review[];
  createdAt: string;
}

export interface PaginationMeta {
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}
