import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { MainLayout } from './MainLayout'

describe('MainLayout Component', () => {
  it('should render and match snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <MainLayout />
      </MemoryRouter>,
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('should display the branding and navigation link', () => {
    render(
      <MemoryRouter>
        <MainLayout />
      </MemoryRouter>,
    )

    const bookingLink = screen.getByText(/my bookings/i)
    expect(bookingLink).toBeInTheDocument()
  })
})
