import { http } from '@/core/services/http'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { PaginatedResponse, Stay } from '../types'
import { staysService } from './api'

vi.mock('@/core/services/http')

describe('staysService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getAll', () => {
    it('should fetch all stays with default empty params', async () => {
      const mockResponse: PaginatedResponse<Stay> = {
        data: [],
        meta: {
          totalCount: 0,
          page: 1,
          limit: 10,
          totalPages: 0,
          hasNextPage: false,
          hasPrevPage: false,
        },
      }

      vi.mocked(http.get).mockResolvedValue({ data: mockResponse })

      const result = await staysService.getAll()

      expect(http.get).toHaveBeenCalledWith('/stays', {})
      expect(result.data).toEqual(mockResponse)
    })
  })

  describe('getById', () => {
    it('should fetch a single stay by its ID', async () => {
      const mockStay = { id: '123', name: 'Mountain View' } as Stay
      vi.mocked(http.get).mockResolvedValue({ data: mockStay })

      // eslint-disable-next-line testing-library/no-await-sync-queries
      const response = await staysService.getById('123')

      expect(http.get).toHaveBeenCalledWith('/stays/123')
      expect(response.data).toEqual(mockStay)
    })
  })
})
