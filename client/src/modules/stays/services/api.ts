import { http } from "@/core/services/http";
import type { PaginatedResponse, Stay } from "../models";

export interface StaysQueryParams {
  page?: number;
  limit?: number;
  location?: string; // Matching your Prisma 'location' field
}

export const staysService = {
  // Now returns the paginated object instead of a raw array
  getAll: (params: StaysQueryParams = {}) =>
    http.get<PaginatedResponse<Stay>>("/stays", params as Record<string, any>),

  getById: (id: string) => http.get<Stay>(`/stays/${id}`),
};
