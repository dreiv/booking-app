import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useStayDetails } from '../hooks/useStayDetails'
import { StayDetailsView } from './StayDetailsView'

vi.mock('../hooks/useStayDetails')
vi.mock('@/core/utils/formatters')

vi.mock('@/modules/reviews/components/AddReviewForm', () => ({
  AddReviewForm: () => <div data-testid="mock-add-review-form">Add Review Form Mock</div>,
}))

vi.mock('@/modules/reviews/components/ReviewList', () => ({
  ReviewList: () => <div data-testid="mock-review-list">Review List Mock</div>,
}))

describe('StayDetailsView', () => {
  const mockStay = {
    id: 'stay-123',
    name: 'Modern Apartment',
    location: 'Cluj-Napoca',
    price: 300,
    description: 'A beautiful place to stay.',
    images: ['img1.jpg', 'img2.jpg', 'img3.jpg'],
    reviews: [],
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders loading state correctly', () => {
    vi.mocked(useStayDetails).mockReturnValue({
      isLoading: true,
      isError: false,
      data: null,
    } as any)

    render(
      <MemoryRouter>
        <StayDetailsView />
      </MemoryRouter>,
    )

    expect(screen.getByText(/loading stay details/i)).toBeInTheDocument()
  })

  it('renders stay details and child component placeholders', () => {
    vi.mocked(useStayDetails).mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockStay,
    } as any)

    render(
      <MemoryRouter initialEntries={['/stays/stay-123']}>
        <Routes>
          <Route path="/stays/:id" element={<StayDetailsView />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('Modern Apartment')).toBeInTheDocument()
    expect(screen.getByText('Cluj-Napoca')).toBeInTheDocument()

    const priceElements = screen.getAllByText('300 RON')
    expect(priceElements.length).toBe(2)

    expect(screen.getByText('A beautiful place to stay.')).toBeInTheDocument()

    expect(screen.getByTestId('mock-review-list')).toBeInTheDocument()
    expect(screen.getByTestId('mock-add-review-form')).toBeInTheDocument()
  })

  it('renders error state when stay is not found', () => {
    vi.mocked(useStayDetails).mockReturnValue({
      isLoading: false,
      isError: true,
      data: null,
    } as any)

    render(
      <MemoryRouter>
        <StayDetailsView />
      </MemoryRouter>,
    )

    expect(screen.getByText(/stay not found/i)).toBeInTheDocument()
  })
})
