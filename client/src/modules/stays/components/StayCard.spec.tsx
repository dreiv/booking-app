import { formatCurrency } from '@/core/utils/formatters'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, useNavigate } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Stay } from '../types'
import { StayCard } from './StayCard'

vi.mock('@/core/utils/formatters')
vi.mock('@/modules/favorites/components/FavoriteButton', () => ({
  FavoriteButton: ({ stayId }: { stayId: string }) => (
    <div data-testid="mock-favorite-button">Fav {stayId}</div>
  ),
}))

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router')
  return {
    ...actual,
    useNavigate: vi.fn(),
  }
})

describe('StayCard', () => {
  const mockNavigate = vi.fn()
  const mockStay: Stay = {
    id: 'stay-1',
    name: 'Transylvanian Castle',
    location: 'Brașov, Romania',
    price: 1200,
    rating: 4.8,
    images: ['img1.jpg', 'img2.jpg'],
    _count: { bookings: 0 },
  } as any

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useNavigate).mockReturnValue(mockNavigate)
    vi.mocked(formatCurrency).mockImplementation((val) => `${val} RON`)
  })

  it('renders stay information correctly', () => {
    render(
      <MemoryRouter>
        <StayCard stay={mockStay} />
      </MemoryRouter>,
    )
    expect(screen.getByText('Transylvanian Castle')).toBeInTheDocument()
    expect(screen.getByText('1200 RON')).toBeInTheDocument()
  })

  it('shows "Booked" badge and disables button when stay is booked', () => {
    const bookedStay = { ...mockStay, _count: { bookings: 1 } }
    render(
      <MemoryRouter>
        <StayCard stay={bookedStay} />
      </MemoryRouter>,
    )

    // Matches the actual "Booked" text in your component
    expect(screen.getByText(/Booked/i)).toBeInTheDocument()
    const bookBtn = screen.getByRole('button', { name: /unavailable/i })
    expect(bookBtn).toBeDisabled()
  })

  it('renders "No Image" placeholder when images are empty', () => {
    const emptyStay = { ...mockStay, images: [] }
    render(
      <MemoryRouter>
        <StayCard stay={emptyStay} />
      </MemoryRouter>,
    )
    expect(screen.getByText(/No Image/i)).toBeInTheDocument()
  })

  it('navigates to checkout when the Book button is clicked', () => {
    render(
      <MemoryRouter>
        <StayCard stay={mockStay} />
      </MemoryRouter>,
    )
    const bookBtn = screen.getByRole('button', { name: /book/i })
    fireEvent.click(bookBtn)
    expect(mockNavigate).toHaveBeenCalledWith(`/checkout/${mockStay.id}`)
  })

  it('applies compact styles and hides "Per Night" label in compact mode', () => {
    render(
      <MemoryRouter>
        <StayCard stay={mockStay} variant="compact" />
      </MemoryRouter>,
    )

    // "Per Night" is only rendered when !isCompact
    expect(screen.queryByText(/Per Night/i)).not.toBeInTheDocument()
    // Price should still be there with the "/ night" span
    expect(screen.getByText(/\/ night/i)).toBeInTheDocument()
  })
})
