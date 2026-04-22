import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { StaySearch } from './StaySearch'

const mockSetSearchParams = vi.fn()
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router')
  return {
    ...actual,
    useSearchParams: () => [new URLSearchParams(), mockSetSearchParams],
  }
})

describe('StaySearch', () => {
  it('updates search params on submit', () => {
    render(
      <MemoryRouter>
        <StaySearch />
      </MemoryRouter>,
    )

    const input = screen.getByPlaceholderText(/search by city/i)
    const button = screen.getByRole('button', { name: /search/i })

    fireEvent.change(input, { target: { value: 'Cluj' } })
    fireEvent.click(button)

    expect(mockSetSearchParams).toHaveBeenCalledWith({
      location: 'Cluj',
      page: '1',
    })
  })

  it('clears params if search is empty', () => {
    render(
      <MemoryRouter>
        <StaySearch />
      </MemoryRouter>,
    )

    const button = screen.getByRole('button', { name: /search/i })
    fireEvent.click(button)

    expect(mockSetSearchParams).toHaveBeenCalledWith({})
  })
})
