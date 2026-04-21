import { describe, expect, it } from 'vitest'
import { formatCurrency, formatDate } from './formatters'

describe('formatters', () => {
  describe('formatCurrency', () => {
    it('should format numbers as RON without decimals', () => {
      const result = formatCurrency(1200)

      expect(result).toMatch(/1\.200/)
      expect(result).toMatch(/RON|lei/)
    })

    it('should handle zero correctly', () => {
      expect(formatCurrency(0)).toMatch(/0/)
    })
  })

  describe('formatDate', () => {
    it('should format date strings to Romanian short format', () => {
      const date = '2026-10-01'
      const result = formatDate(date)

      expect(result).toContain('1')
      expect(result).toContain('oct.')
      expect(result).toContain('2026')
    })

    it('should accept Date objects', () => {
      const date = new Date(2026, 3, 21) // April 21, 2026
      const result = formatDate(date)

      expect(result).toContain('21')
      expect(result).toContain('apr.')
      expect(result).toContain('2026')
    })
  })
})
