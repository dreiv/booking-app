import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useStays } from '../hooks/useStays'
import { useViewStore } from '../hooks/useViewStore'
import { StaysView } from './StaysView'

vi.mock('../hooks/useStays')
vi.mock('../hooks/useViewStore')
vi.mock('../components/StaySearch', () => ({ StaySearch: () => <div data-testid="stay-search" /> }))
vi.mock('../components/StaysMap', () => ({ StaysMap: () => <div data-testid="stays-map" /> }))

const mockSetSearchParams = vi.fn()
const mockSetViewMode = vi.fn()

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router')
  return {
    ...actual,
    useSearchParams: () => [new URLSearchParams(), mockSetSearchParams],
  }
})

describe('StaysView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(useViewStore as any).mockReturnValue({
      viewMode: 'grid',
      setViewMode: mockSetViewMode,
    })
    ;(useStays as any).mockReturnValue({
      data: { data: [], meta: { totalPages: 1, totalCount: 0 } },
      isLoading: false,
      isError: false,
    })

    window.scrollTo = vi.fn()
  })

  it('renders the search bar and initial "trending" title', () => {
    render(
      <MemoryRouter>
        <StaysView />
      </MemoryRouter>,
    )
    expect(screen.getByTestId('stay-search')).toBeInTheDocument()
    expect(screen.getByText(/Explore trending stays/i)).toBeInTheDocument()
  })

  it('switches to map view and increases the fetch limit', () => {
    render(
      <MemoryRouter>
        <StaysView />
      </MemoryRouter>,
    )

    const mapButton = screen.getByLabelText(/Map view/i)
    fireEvent.click(mapButton)

    expect(mockSetViewMode).toHaveBeenCalledWith('map')

    expect(mockSetSearchParams).toHaveBeenCalled()
    const calledParams = mockSetSearchParams.mock.calls[0][0]
    expect(calledParams.get('page')).toBe('1')
  })

  it('clears map coordinates when switching from map back to grid', () => {
    ;(useViewStore as any).mockReturnValue({
      viewMode: 'map',
      setViewMode: mockSetViewMode,
    })

    render(
      <MemoryRouter initialEntries={['/stays?nwLat=45&nwLng=25']}>
        <StaysView />
      </MemoryRouter>,
    )

    const gridButton = screen.getByLabelText(/Grid view/i)
    fireEvent.click(gridButton)

    const paramsAfterSwitch = mockSetSearchParams.mock.calls[0][0]
    expect(paramsAfterSwitch.get('nwLat')).toBeNull()
    expect(paramsAfterSwitch.get('page')).toBe('1')
  })

  it('displays an error message when the hook returns isError', () => {
    ;(useStays as any).mockReturnValue({
      isError: true,
      error: { message: 'API Failure' },
    })

    render(
      <MemoryRouter>
        <StaysView />
      </MemoryRouter>,
    )

    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument()
    expect(screen.getByText(/API Failure/i)).toBeInTheDocument()
  })
})
