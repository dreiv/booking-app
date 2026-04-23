import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router'
import { describe, expect, it } from 'vitest'
import { StaySearch } from './StaySearch'

const LocationDisplay = () => {
  const location = useLocation()
  return <div data-testid="location">{location.search}</div>
}

describe('StaySearch', () => {
  it('updates the URL correctly on submit', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <StaySearch />
                <LocationDisplay />
              </>
            }
          />
        </Routes>
      </MemoryRouter>,
    )

    const input = screen.getByPlaceholderText(/search city/i)
    const minInput = screen.getByPlaceholderText(/min/i)
    const button = screen.getByRole('button', { name: /search/i })

    fireEvent.change(input, { target: { value: 'Brașov' } })
    fireEvent.change(minInput, { target: { value: '500' } })
    fireEvent.click(button)

    const location = screen.getByTestId('location')
    expect(location.textContent).toContain('location=Bra%C8%99ov')
    expect(location.textContent).toContain('minPrice=500')
    expect(location.textContent).toContain('page=1')
  })

  it('only navigates when search is clicked (local state isolation)', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <StaySearch />
                <LocationDisplay />
              </>
            }
          />
        </Routes>
      </MemoryRouter>,
    )

    const input = screen.getByPlaceholderText(/search city/i)
    fireEvent.change(input, { target: { value: 'Testing' } })

    expect(screen.getByTestId('location').textContent).toBe('')
  })

  it('focuses input when CMD+K is pressed', () => {
    render(
      <MemoryRouter>
        <StaySearch />
      </MemoryRouter>,
    )

    const input = screen.getByPlaceholderText(/search city/i)
    fireEvent.keyDown(window, { key: 'k', metaKey: true })

    expect(input).toHaveFocus()
  })

  it('initializes form with existing URL params', () => {
    render(
      <MemoryRouter initialEntries={['/?location=Cluj&sort=price_asc']}>
        <StaySearch />
      </MemoryRouter>,
    )

    const input = screen.getByPlaceholderText(/search city/i) as HTMLInputElement
    const select = screen.getByRole('combobox') as HTMLSelectElement

    expect(input.value).toBe('Cluj')
    expect(select.value).toBe('price_asc')
  })
})
