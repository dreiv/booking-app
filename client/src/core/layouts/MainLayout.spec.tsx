import { useFavorites } from '@/modules/favorites/hooks/useFavorites'
import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MainLayout } from './MainLayout'

vi.mock('@/modules/favorites/hooks/useFavorites')

describe('MainLayout Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(useFavorites as unknown as any).mockReturnValue(0)
  })

  it('should render and match snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <MainLayout />
      </MemoryRouter>,
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('should display the branding logo', () => {
    render(
      <MemoryRouter>
        <MainLayout />
      </MemoryRouter>,
    )

    const header = screen.getByRole('banner')
    expect(within(header).getByText(/Stay/i)).toBeInTheDocument()
    expect(within(header).getByText(/Easy/i)).toBeInTheDocument()
  })

  it('should display navigation links', () => {
    render(
      <MemoryRouter>
        <MainLayout />
      </MemoryRouter>,
    )

    expect(screen.getByText(/Favorites/i)).toBeInTheDocument()
    expect(screen.getByText(/My Bookings/i)).toBeInTheDocument()
  })

  it('should show the correct favorite count badge when favorites exist', () => {
    ;(useFavorites as unknown as any).mockReturnValue(3)

    render(
      <MemoryRouter>
        <MainLayout />
      </MemoryRouter>,
    )

    const badge = screen.getByText('3')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveClass('bg-accent')
  })

  it('should not show a badge when favorite count is 0', () => {
    ;(useFavorites as unknown as any).mockReturnValue(0)

    render(
      <MemoryRouter>
        <MainLayout />
      </MemoryRouter>,
    )

    const badge = screen.queryByText('0')
    expect(badge).not.toBeInTheDocument()
  })

  it('should render the footer with the current year', () => {
    render(
      <MemoryRouter>
        <MainLayout />
      </MemoryRouter>,
    )

    const currentYear = new Date().getFullYear().toString()
    expect(screen.getByText(new RegExp(currentYear))).toBeInTheDocument()
  })
})
