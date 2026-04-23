import { useStays } from '@/modules/stays/hooks/useStays'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useFavorites } from '../hooks/useFavorites'
import { FavoritesView } from './FavoritesView'

vi.mock('../hooks/useFavorites')
vi.mock('@/modules/stays/hooks/useStays')

vi.mock('@/modules/stays/components/StayGrid', () => ({
  StayGrid: ({ stays, loading, emptyMessage }: any) => (
    <div data-testid="stay-grid">
      {loading && <span>Loading...</span>}
      {!loading && stays.length === 0 && <span>{emptyMessage}</span>}
      {stays.map((s: any) => (
        <div key={s.id}>{s.name}</div>
      ))}
    </div>
  ),
}))

describe('FavoritesView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders empty state correctly when no favorites exist', () => {
    vi.mocked(useFavorites).mockImplementation((selector: any) => selector({ favoriteIds: [] }))

    vi.mocked(useStays).mockReturnValue({
      data: undefined,
      isLoading: false,
    } as any)

    render(<FavoritesView />)

    expect(screen.getByText(/0 stays saved/i)).toBeInTheDocument()
    expect(screen.getByText(/haven't saved any stays yet/i)).toBeInTheDocument()
  })

  it('renders loading state when favorites exist but data is fetching', () => {
    vi.mocked(useFavorites).mockImplementation((selector: any) =>
      selector({ favoriteIds: ['1', '2'] }),
    )

    vi.mocked(useStays).mockReturnValue({
      data: undefined,
      isLoading: true,
    } as any)

    render(<FavoritesView />)

    expect(screen.getByText(/2 stays saved/i)).toBeInTheDocument()
    expect(screen.getByText(/loading.../i)).toBeInTheDocument()
  })

  it('renders the grid with favorite stays when data is loaded', () => {
    const mockStays = [
      { id: '1', name: 'Luxury Villa' },
      { id: '2', name: 'Mountain Retreat' },
    ]

    vi.mocked(useFavorites).mockImplementation((selector: any) =>
      selector({ favoriteIds: ['1', '2'] }),
    )

    vi.mocked(useStays).mockReturnValue({
      data: { data: mockStays },
      isLoading: false,
    } as any)

    render(
      <MemoryRouter>
        <FavoritesView />
      </MemoryRouter>,
    )

    expect(screen.getByText('Luxury Villa')).toBeInTheDocument()
    expect(screen.getByText('Mountain Retreat')).toBeInTheDocument()
    expect(screen.queryByText(/loading.../i)).not.toBeInTheDocument()
  })
})
