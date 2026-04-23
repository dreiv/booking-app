import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useStays } from '../hooks/useStays'
import { StaysListView } from './StaysListView'

vi.mock('../hooks/useStays')

window.scrollTo = vi.fn()

const LocationDisplay = () => {
  const location = useLocation()
  return <div data-testid="url-display">{location.search}</div>
}

describe('StaysListView', () => {
  const mockData = {
    data: [{ id: '1', name: 'Stay 1' }],
    meta: {
      totalPages: 5,
      hasNextPage: true,
      totalCount: 45,
      page: 1,
      limit: 9,
    },
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useStays).mockReturnValue({
      data: mockData,
      isLoading: false,
      isError: false,
      isPlaceholderData: false,
    } as any)
  })

  it('renders the list header correctly with filter context', () => {
    render(
      <MemoryRouter initialEntries={['/stays?location=Cluj']}>
        <StaysListView />
      </MemoryRouter>,
    )

    expect(screen.getByText(/stays in "Cluj"/i)).toBeInTheDocument()
    expect(screen.getByText(/45 properties found/i)).toBeInTheDocument()
  })

  it('updates URL when "Next" is clicked', () => {
    render(
      <MemoryRouter initialEntries={['/stays?page=1']}>
        <Routes>
          <Route
            path="/stays"
            element={
              <>
                <StaysListView />
                <LocationDisplay />
              </>
            }
          />
        </Routes>
      </MemoryRouter>,
    )

    const nextButton = screen.getByRole('button', { name: /next/i })
    fireEvent.click(nextButton)

    const urlDisplay = screen.getByTestId('url-display')
    expect(urlDisplay.textContent).toContain('page=2')
  })

  it('clears all filters when "Clear all filters" is clicked', () => {
    render(
      <MemoryRouter initialEntries={['/stays?location=Cluj&minPrice=100']}>
        <Routes>
          <Route
            path="/stays"
            element={
              <>
                <StaysListView />
                <LocationDisplay />
              </>
            }
          />
        </Routes>
      </MemoryRouter>,
    )

    const clearButton = screen.getByRole('button', { name: /clear all filters/i })
    fireEvent.click(clearButton)

    const urlDisplay = screen.getByTestId('url-display')
    expect(urlDisplay.textContent).toBe('')
  })

  it('displays an error message when the hook returns an error', () => {
    vi.mocked(useStays).mockReturnValue({
      isError: true,
      error: { message: 'Failed to fetch' },
    } as any)

    render(
      <MemoryRouter>
        <StaysListView />
      </MemoryRouter>,
    )

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    expect(screen.getByText('Failed to fetch')).toBeInTheDocument()
  })

  it('applies lower opacity when viewing placeholder data', () => {
    vi.mocked(useStays).mockReturnValue({
      data: mockData,
      isPlaceholderData: true,
    } as any)

    render(
      <MemoryRouter>
        <StaysListView />
      </MemoryRouter>,
    )

    const contentWrapper = screen.getByTestId('stays-list-content')
    expect(contentWrapper).toHaveClass('opacity-50')
    expect(contentWrapper).toHaveClass('pointer-events-none')
  })
})
