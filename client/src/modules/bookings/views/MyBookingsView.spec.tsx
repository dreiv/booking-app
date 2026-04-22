import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useBookings } from '../hooks/useBookings'
import { MyBookingsView } from './MyBookingsView'

vi.mock('../hooks/useBookings')
vi.mock('@/core/utils/formatters')

describe('MyBookingsView', () => {
  const mockBookings = [
    {
      id: 'book-111',
      status: 'Confirmed',
      checkIn: '2023-10-12',
      checkOut: '2023-10-15',
      totalPrice: 1200,
      stay: {
        name: 'Transylvanian Castle',
        location: 'Bran, Romania',
        images: ['castle.jpg'],
      },
    },
    {
      id: 'book-222',
      status: 'Confirmed',
      stay: { name: 'Hidden Gem', location: 'Sibiu', images: ['gem.jpg'] },
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    const savedIds = JSON.stringify(['book-111'])
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(savedIds)
  })

  it('renders the loading state', () => {
    vi.mocked(useBookings).mockReturnValue({ data: undefined, isLoading: true } as any)

    render(<MyBookingsView />)
    expect(screen.getByText(/loading your trips/i)).toBeInTheDocument()
  })

  it('filters and displays only the user’s specific bookings', () => {
    vi.mocked(useBookings).mockReturnValue({
      data: mockBookings,
      isLoading: false,
    } as any)

    render(<MyBookingsView />)

    expect(screen.getByText('Transylvanian Castle')).toBeInTheDocument()
    expect(screen.getByText('1200 RON')).toBeInTheDocument()

    expect(screen.queryByText('Hidden Gem')).not.toBeInTheDocument()
  })

  it('shows the empty state when no bookings match localStorage', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('[]')
    vi.mocked(useBookings).mockReturnValue({
      data: mockBookings,
      isLoading: false,
    } as any)

    render(<MyBookingsView />)

    expect(screen.getByText(/haven't booked any stays yet/i)).toBeInTheDocument()
    expect(screen.queryByText('Transylvanian Castle')).not.toBeInTheDocument()
  })
})
