import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useStayDetails } from '../hooks/useStayDetails'
import { StayDetailsView } from './StayDetailsView'

vi.mock('../hooks/useStayDetails')

vi.mock('@/modules/reviews/components/AddReviewForm', () => ({
  AddReviewForm: () => <div data-testid="add-review-form" />,
}))
vi.mock('@/modules/reviews/components/ReviewList', () => ({
  ReviewList: () => <div data-testid="review-list" />,
}))

const mockNavigate = vi.fn()
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: 'stay-123' }),
  }
})

describe('StayDetailsView', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(useStayDetails).mockReturnValue({
      data: {
        id: 'stay-123',
        name: 'Luxury Cabin',
        price: 200,
        location: 'Mountain View',
        description: 'Nice place',
        images: [],
        reviews: [],
      },
      isLoading: false,
      isError: false,
    } as any)
  })

  it('navigates to checkout when "Reserve Now" is clicked', () => {
    render(
      <MemoryRouter>
        <StayDetailsView />
      </MemoryRouter>,
    )

    const reserveButton = screen.getByRole('button', { name: /reserve now/i })
    fireEvent.click(reserveButton)

    expect(mockNavigate).toHaveBeenCalledWith('/checkout/stay-123')
  })

  it('contains the correct back link to the home page', () => {
    render(
      <MemoryRouter>
        <StayDetailsView />
      </MemoryRouter>,
    )

    // Using a regex to find the link text regardless of the icon component inside it
    const backLink = screen.getByRole('link', { name: /back to all stays/i })
    expect(backLink).toHaveAttribute('href', '/')
  })
})
