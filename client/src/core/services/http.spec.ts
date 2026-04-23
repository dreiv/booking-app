import { beforeEach, describe, expect, it, vi } from 'vitest'
import { http } from './http'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

describe('http utility', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ data: 'success' }),
    })
  })

  describe('GET requests', () => {
    it('should construct the correct URL with simple query parameters', async () => {
      await http.get('/bookings', { id: '123', status: 'confirmed' })

      const url = mockFetch.mock.calls[0][0]
      expect(url).toContain('/bookings?id=123&status=confirmed')
    })

    // CRITICAL TEST: Verifies the fix for array serialization
    it('should correctly serialize array parameters using append', async () => {
      await http.get('/stays', { ids: ['stay1', 'stay2'], limit: 10 })

      const url = mockFetch.mock.calls[0][0]
      // Should look like ?ids=stay1&ids=stay2&limit=10
      expect(url).toContain('ids=stay1')
      expect(url).toContain('ids=stay2')
      expect(url).toContain('limit=10')
    })

    it('should ignore null or undefined parameters', async () => {
      await http.get('/test', { valid: 'yes', invalid: undefined })

      const url = mockFetch.mock.calls[0][0]
      expect(url).toContain('?valid=yes')
      expect(url).not.toContain('invalid')
      expect(url).not.toContain('empty')
    })

    it('should include default headers', async () => {
      await http.get('/test')

      const callOptions = mockFetch.mock.calls[0][1]
      const headers = callOptions.headers as Headers

      expect(headers.get('Content-Type')).toBe('application/json')
      expect(headers.get('Accept')).toBe('application/json')
    })
  })

  describe('POST requests', () => {
    it('should stringify the body and use POST method', async () => {
      const payload = { title: 'New Booking' }
      await http.post('/bookings', payload)

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(payload),
        }),
      )
    })
  })

  describe('Error Handling', () => {
    it('should throw an error with message from server if response is not ok', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: async () => ({ message: 'Invalid dates selected' }),
      })

      await expect(http.get('/test')).rejects.toThrow('Invalid dates selected')
    })

    it('should fallback to status text if json body has no message', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => ({}),
      })

      await expect(http.get('/test')).rejects.toThrow('HTTP 500: Internal Server Error')
    })

    it('should return an empty object for 204 No Content', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 204,
      })

      const result = await http.get('/test')
      expect(result).toEqual({})
    })
  })

  describe('Custom Options', () => {
    it('should allow overriding or adding headers', async () => {
      await http.get('/test', {}, { headers: { 'X-Custom': 'hello' } })

      const callOptions = mockFetch.mock.calls[0][1]
      const headers = callOptions.headers as Headers
      expect(headers.get('X-Custom')).toBe('hello')
    })
  })
})
