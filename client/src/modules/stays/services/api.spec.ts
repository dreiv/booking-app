import { http } from '@/core/services/http'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { staysService } from './api'

vi.mock('@/core/services/http')

describe('staysService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getAll', () => {
    it('should fetch all stays with default empty params', async () => {
      const mockResponse = { data: [], total: 0, page: 1, limit: 10 }
      vi.mocked(http.get).mockResolvedValue({ data: mockResponse })

      const result = await staysService.getAll()

      expect(http.get).toHaveBeenCalledWith('/stays', {})
      expect(result.data).toEqual(mockResponse)
    })

    it('should pass query parameters correctly', async () => {
      const params = { location: 'Cluj', page: 2, limit: 5 }
      vi.mocked(http.get).mockResolvedValue({ data: { data: [] } })

      await staysService.getAll(params)

      expect(http.get).toHaveBeenCalledWith('/stays', params)
    })
  })

  describe('getById', () => {
    it('should fetch a single stay by its ID', async () => {
      const mockStay = { id: '123', name: 'Mountain View' }
      vi.mocked(http.get).mockResolvedValue({ data: mockStay })

      const result = await (staysService.getById('123') as any)

      expect(http.get).toHaveBeenCalledWith('/stays/123')
      expect(result.data).toEqual(mockStay)
    })
  })
})
