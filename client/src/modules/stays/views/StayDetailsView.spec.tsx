import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useStayDetails } from '../hooks/useStayDetails'
import { StayDetailsView } from './StayDetailsView'

vi.mock('../hooks/useStayDetails')

vi.mock('@/core/utils/formatters', () => ({
  formatCurrency: (val: number) => `$${val}`,
}))

vi.mock('@/modules/reviews/components/AddReviewForm', () => ({
  AddReviewForm: () => <div data-testid="add-review-form" />,
}))

vi.mock('@/modules/reviews/components/ReviewList', () => ({
  ReviewList: () => <div data-testid="review-list" />,
}))

vi.mock('@/modules/favorites/components/FavoriteButton', () => ({
  FavoriteButton: () => <button>Fav</button>,
}))

vi.mock('@/core/components/ImageLightbox', () => ({
  ImageLightbox: ({ onClose }: any) => (
    <div data-testid="lightbox">
      <button onClick={onClose}>Close Lightbox</button>
    </div>
  ),
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
  const mockStay = {
    id: 'stay-123',
    name: 'Luxury Cabin',
    price: 200,
    location: 'Mountain View',
    description: 'A very nice place to stay.',
    images: ['img1.jpg', 'img2.jpg', 'img3.jpg'],
    reviews: [],
    _count: { bookings: 0 },
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useStayDetails).mockReturnValue({
      data: mockStay,
      isLoading: false,
      isError: false,
    } as any)
  })

  it('renders loading state correctly', () => {
    vi.mocked(useStayDetails).mockReturnValue({
      isLoading: true,
    } as any)

    render(
      <MemoryRouter>
        <StayDetailsView />
      </MemoryRouter>,
    )

    expect(screen.getByText(/loading stay/i)).toBeInTheDocument()
  })

  it('renders stay details correctly', () => {
    render(
      <MemoryRouter>
        <StayDetailsView />
      </MemoryRouter>,
    )

    expect(screen.getByText('Luxury Cabin')).toBeInTheDocument()
    expect(screen.getByText(/Mountain View/i)).toBeInTheDocument()

    expect(screen.getByText('$200')).toBeInTheDocument()
  })

  it('navigates back when the Back button is clicked', () => {
    render(
      <MemoryRouter>
        <StayDetailsView />
      </MemoryRouter>,
    )

    const backBtn = screen.getByRole('button', { name: /back/i })
    fireEvent.click(backBtn)

    expect(mockNavigate).toHaveBeenCalledWith(-1)
  })

  it('opens the lightbox when the main image is clicked', () => {
    render(
      <MemoryRouter>
        <StayDetailsView />
      </MemoryRouter>,
    )

    const mainImgBtn = screen.getByRole('button', { name: /view luxury cabin gallery/i })
    fireEvent.click(mainImgBtn)

    expect(screen.getByTestId('lightbox')).toBeInTheDocument()

    fireEvent.click(screen.getByText(/close lightbox/i))
    expect(screen.queryByTestId('lightbox')).not.toBeInTheDocument()
  })

  it('handles booked state correctly and prevents navigation', () => {
    vi.mocked(useStayDetails).mockReturnValue({
      data: { ...mockStay, _count: { bookings: 1 } },
      isLoading: false,
      isError: false,
    } as any)

    render(
      <MemoryRouter>
        <StayDetailsView />
      </MemoryRouter>,
    )

    expect(screen.getByText(/already booked/i)).toBeInTheDocument()
    expect(screen.getByText(/property is currently unavailable/i)).toBeInTheDocument()

    const reserveButton = screen.getByRole('button', { name: /unavailable/i })
    expect(reserveButton).toBeDisabled()
    expect(reserveButton).toHaveClass('pointer-events-none')

    fireEvent.click(reserveButton)
    expect(mockNavigate).not.toHaveBeenCalled()

    expect(screen.queryByText(/service fee/i)).not.toBeInTheDocument()
  })

  it('navigates to checkout when Reserve Now is clicked and available', () => {
    render(
      <MemoryRouter>
        <StayDetailsView />
      </MemoryRouter>,
    )

    const reserveButton = screen.getByRole('button', { name: /reserve now/i })
    fireEvent.click(reserveButton)

    expect(mockNavigate).toHaveBeenCalledWith('/checkout/stay-123')
  })
})
