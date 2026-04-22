import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { App } from './App'

vi.mock('./modules/stays/views/StaysListView', () => ({
  StaysListView: () => <div data-testid="stays-list">Stays List Page</div>,
}))

vi.mock('./modules/stays/views/StayDetailsView', () => ({
  StayDetailsView: () => <div data-testid="stay-details">Stay Details Page</div>,
}))

vi.mock('./core/views/NotFoundView', () => ({
  NotFoundView: () => <div data-testid="not-found">404 Page</div>,
}))

describe('App Routing', () => {
  it('renders the list view on the root path', async () => {
    window.history.pushState({}, 'Home', '/')
    render(<App />)

    expect(screen.getByTestId('stays-list')).toBeInTheDocument()
  })

  it('renders the details view for a specific stay ID', async () => {
    window.history.pushState({}, 'Details', '/stays/123')
    render(<App />)

    await waitFor(() => {
      expect(screen.getByTestId('stay-details')).toBeInTheDocument()
    })
  })

  it('renders the 404 page for non-existent routes', async () => {
    window.history.pushState({}, 'Not Found', '/some/random/route')
    render(<App />)

    expect(screen.getByTestId('not-found')).toBeInTheDocument()
  })
})
