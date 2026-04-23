import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useFavorites } from '../hooks/useFavorites'
import { FavoriteButton } from './FavoriteButton'

vi.mock('../hooks/useFavorites')

describe('FavoriteButton', () => {
  const mockToggle = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders correctly in the default (unselected) state', () => {
    vi.mocked(useFavorites).mockImplementation((selector: any) => {
      const state = {
        favoriteIds: [],
        toggleFavorite: mockToggle,
      }
      return selector ? selector(state) : state
    })

    render(<FavoriteButton stayId="stay-1" />)

    const button = screen.getByRole('button', { name: /add to favorites/i })
    expect(button).toBeInTheDocument()

    const icon = screen.getByTestId('heart-icon')
    expect(icon).not.toHaveClass('fill-[var(--accent)]')
  })

  it('renders correctly when the item is a favorite', () => {
    vi.mocked(useFavorites).mockImplementation((selector: any) => {
      const state = {
        favoriteIds: ['stay-1'],
        toggleFavorite: mockToggle,
      }
      return selector ? selector(state) : state
    })

    render(<FavoriteButton stayId="stay-1" />)

    const button = screen.getByRole('button', { name: /remove from favorites/i })
    expect(button).toBeInTheDocument()

    const icon = screen.getByTestId('heart-icon')
    expect(icon).toHaveClass('fill-[var(--accent)]')
  })

  it('calls toggleFavorite with correct ID when clicked', () => {
    vi.mocked(useFavorites).mockImplementation((selector: any) => {
      const state = {
        favoriteIds: [],
        toggleFavorite: mockToggle,
      }
      return selector ? selector(state) : state
    })

    render(<FavoriteButton stayId="stay-999" />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(mockToggle).toHaveBeenCalledWith('stay-999')
  })

  it('stops event propagation to prevent triggering parent clicks', () => {
    vi.mocked(useFavorites).mockImplementation((selector: any) => {
      const state = {
        favoriteIds: [],
        toggleFavorite: mockToggle,
      }
      return selector ? selector(state) : state
    })

    const parentClick = vi.fn()

    render(
      <div onClick={parentClick}>
        <FavoriteButton stayId="stay-1" />
      </div>,
    )

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(mockToggle).toHaveBeenCalled()
    expect(parentClick).not.toHaveBeenCalled()
  })
})
