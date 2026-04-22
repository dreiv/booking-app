import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ReviewList } from './ReviewList'

describe('ReviewList', () => {
  const mockReviews = [
    {
      id: '1',
      authorName: 'A',
      rating: 5,
      comment: 'Nice',
      createdAt: '2023-10-12T10:00:00Z',
      stayId: 's1',
    },
    {
      id: '2',
      authorName: 'B',
      rating: 3,
      comment: 'Ok',
      createdAt: '2023-10-12T11:00:00Z',
      stayId: 's1',
    },
  ]

  it('renders empty state when no reviews', () => {
    render(<ReviewList stayId="s1" reviews={[]} />)
    expect(screen.getByText(/No reviews yet/i)).toBeInTheDocument()
  })

  it('calculates and displays the correct average rating', () => {
    render(<ReviewList stayId="s1" reviews={mockReviews} />)

    // (5 + 3) / 2 = 4.0
    expect(screen.getByText('4.0')).toBeInTheDocument()
    expect(screen.getByText('2 total reviews')).toBeInTheDocument()
  })

  it('renders the correct number of ReviewItems', () => {
    render(<ReviewList stayId="s1" reviews={mockReviews} />)

    expect(screen.getByRole('heading', { name: 'A' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'B' })).toBeInTheDocument()
  })
})
