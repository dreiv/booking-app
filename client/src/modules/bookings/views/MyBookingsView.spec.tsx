import { formatCurrency } from '@/core/utils/formatters'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useBookedStays } from '../hooks/useBookedStays'
import { useBookings } from '../hooks/useBookings'
import { MyBookingsView } from './MyBookingsView'

vi.mock('../hooks/useBookings')
vi.mock('../hooks/useBookedStays')
vi.mock('@/core/utils/formatters')

describe('MyBookingsView', () => {
  const mockStays = [
    {
      id: 'stay-1',
      name: 'Transylvanian Castle',
      location: 'Bran, Romania',
      images: ['castle.jpg'],
      price: 1200,
      rating: 5,
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(formatCurrency).mockImplementation((val) => `${val} RON`)
  })

  it('renders the loading state', () => {
    // isLoading is true AND there are IDs present
    vi.mocked(useBookings).mockReturnValue({ bookedStayIds: ['stay-1'] } as any)
    vi.mocked(useBookedStays).mockReturnValue({ data: undefined, isLoading: true } as any)

    render(
      <MemoryRouter>
        <MyBookingsView />
      </MemoryRouter>,
    )
    expect(screen.getByText(/loading your trips/i)).toBeInTheDocument()
  })

  it('displays the list of booked stays', () => {
    vi.mocked(useBookings).mockReturnValue({ bookedStayIds: ['stay-1'] } as any)
    vi.mocked(useBookedStays).mockReturnValue({ data: mockStays, isLoading: false } as any)

    render(
      <MemoryRouter>
        <MyBookingsView />
      </MemoryRouter>,
    )

    expect(screen.getByText('Transylvanian Castle')).toBeInTheDocument()
    expect(screen.getByText('1200 RON')).toBeInTheDocument()
    expect(screen.getByText(/confirmed/i)).toBeInTheDocument()
  })

  it('shows the empty state when no IDs exist in the store', () => {
    vi.mocked(useBookings).mockReturnValue({ bookedStayIds: [] } as any)
    vi.mocked(useBookedStays).mockReturnValue({ data: [], isLoading: false } as any)

    render(
      <MemoryRouter>
        <MyBookingsView />
      </MemoryRouter>,
    )

    expect(screen.getByText(/no trips booked yet/i)).toBeInTheDocument()
    expect(screen.queryByText('Transylvanian Castle')).not.toBeInTheDocument()
  })
})
