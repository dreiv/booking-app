import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { App } from './App'

vi.mock('./modules/stays/views/StaysView', () => ({
  StaysView: () => <div data-testid="stays-list">Stays Page</div>,
}))

vi.mock('./modules/stays/views/StayDetailsView', () => ({
  StayDetailsView: () => <div data-testid="stay-details">Stay Details Page</div>,
}))

vi.mock('./core/views/NotFoundView', () => ({
  NotFoundView: () => <div data-testid="not-found">404 Page</div>,
}))

vi.mock('./modules/favorites/views/FavoritesView', () => ({
  FavoritesView: () => <div data-testid="favorites-view">Favorites Page</div>,
}))

vi.mock('./modules/bookings/views/CheckoutView', () => ({
  CheckoutView: () => <div data-testid="checkout-view">Checkout Page</div>,
}))

vi.mock('./modules/bookings/views/MyBookingsView', () => ({
  MyBookingsView: () => <div data-testid="bookings-view">Bookings Page</div>,
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

  it('renders the favorites view', async () => {
    window.history.pushState({}, 'Favorites', '/favorites')
    render(<App />)
    expect(screen.getByTestId('favorites-view')).toBeInTheDocument()
  })

  it('renders the checkout view with stayId parameter', async () => {
    window.history.pushState({}, 'Checkout', '/checkout/stay-456')
    render(<App />)
    expect(screen.getByTestId('checkout-view')).toBeInTheDocument()
  })

  it('renders the my bookings view', async () => {
    window.history.pushState({}, 'My Bookings', '/bookings')
    render(<App />)
    expect(screen.getByTestId('bookings-view')).toBeInTheDocument()
  })

  it('renders the 404 page for non-existent routes', async () => {
    window.history.pushState({}, 'Not Found', '/some/random/route')
    render(<App />)
    expect(screen.getByTestId('not-found')).toBeInTheDocument()
  })
})
