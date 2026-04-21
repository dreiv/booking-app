import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { NotFoundView } from './NotFoundView'

describe('NotFoundView Component', () => {
  it('should match the snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <NotFoundView />
      </MemoryRouter>,
    )
    expect(asFragment()).toMatchSnapshot()
  })

  it('renders the 404 error message and a link back home', () => {
    render(
      <MemoryRouter>
        <NotFoundView />
      </MemoryRouter>,
    )

    expect(screen.getByText('404')).toBeInTheDocument()
    expect(screen.getByText(/destination doesn't exist/i)).toBeInTheDocument()

    const homeLink = screen.getByRole('link', { name: /return to home/i })
    expect(homeLink).toHaveAttribute('href', '/')
  })
})
