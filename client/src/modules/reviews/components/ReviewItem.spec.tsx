import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ReviewItem } from './ReviewItem'

vi.mock('@/core/utils/formatters')

describe('ReviewItem', () => {
  const mockReview = {
    id: 'r1',
    authorName: 'Maria',
    rating: 5,
    comment: 'Wonderful stay!',
    createdAt: '2023-10-12T10:00:00Z',
    stayId: 's1',
  }

  it('renders review details correctly', () => {
    render(<ReviewItem review={mockReview} />)

    expect(screen.getByText('Maria')).toBeInTheDocument()
    expect(screen.getByText('M')).toBeInTheDocument() // Initial circle
    expect(screen.getByText(/Wonderful stay!/i)).toBeInTheDocument()
    expect(screen.getByText('★ 5')).toBeInTheDocument()
    expect(screen.getByText('1 Jan 2026')).toBeInTheDocument()
  })
})
