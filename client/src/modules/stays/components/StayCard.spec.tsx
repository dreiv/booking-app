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
    images: ['https://example.com/castle1.jpg', 'https://example.com/castle2.jpg'],
    description: 'A beautiful historical castle.',
    latitude: 45.6427,
    longitude: 25.5887,
    createdAt: new Date().toISOString(),
    _count: { bookings: 0 },
  }

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
    expect(screen.getByText(/Brașov, Romania/i)).toBeInTheDocument()
    expect(screen.getByText('1200 RON')).toBeInTheDocument()
    expect(screen.getByText('4.8')).toBeInTheDocument()
  })

  it('shows "Already Booked" badge and disables button when stay is booked', () => {
    const bookedStay = { ...mockStay, _count: { bookings: 1 } }

    render(
      <MemoryRouter>
        <StayCard stay={bookedStay} />
      </MemoryRouter>,
    )

    expect(screen.getByText(/Already Booked/i)).toBeInTheDocument()

    const bookBtn = screen.getByRole('button', { name: /unavailable/i })
    expect(bookBtn).toBeDisabled()

    fireEvent.click(bookBtn)
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('renders both primary and hover images when multiple are provided and not booked', () => {
    render(
      <MemoryRouter>
        <StayCard stay={mockStay} />
      </MemoryRouter>,
    )

    const images = screen.getAllByRole('img')
    expect(images).toHaveLength(2)
    expect(images[1]).toHaveClass('opacity-0')
  })

  it('hides the alternate hover image when the stay is booked', () => {
    const bookedStay = { ...mockStay, _count: { bookings: 1 } }

    render(
      <MemoryRouter>
        <StayCard stay={bookedStay} />
      </MemoryRouter>,
    )

    const images = screen.getAllByRole('img')

    expect(images).toHaveLength(1)
  })

  it('renders "No Image Available" and hides rating star when data is missing', () => {
    const emptyStay = { ...mockStay, images: [], rating: 0 }

    render(
      <MemoryRouter>
        <StayCard stay={emptyStay} />
      </MemoryRouter>,
    )

    expect(screen.getByText(/No Image Available/i)).toBeInTheDocument()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(screen.queryByText('4.8')).not.toBeInTheDocument()
  })

  it('navigates to checkout when the Book button is clicked on available stay', () => {
    render(
      <MemoryRouter>
        <StayCard stay={mockStay} />
      </MemoryRouter>,
    )

    const bookBtn = screen.getByRole('button', { name: /book/i })
    fireEvent.click(bookBtn)

    expect(mockNavigate).toHaveBeenCalledWith(`/checkout/${mockStay.id}`)
  })
})
