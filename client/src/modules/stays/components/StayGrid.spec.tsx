import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { Stay } from '../types'
import { StayGrid } from './StayGrid'

vi.mock('./StayCard', () => ({
  StayCard: ({ stay, variant }: { stay: Stay; variant: string }) => (
    <div data-testid="mock-stay-card">
      {stay.name} - {variant}
    </div>
  ),
}))

describe('StayGrid', () => {
  const mockStays: Stay[] = [{ id: '1', name: 'Stay One' } as Stay]

  it('renders 6 skeletons for default variant', () => {
    render(<StayGrid stays={[]} loading={true} variant="default" />)
    const skeletons = screen.getAllByTestId('stay-skeleton')
    expect(skeletons).toHaveLength(6)
  })

  it('renders 4 skeletons and list classes for compact variant', () => {
    render(<StayGrid stays={[]} loading={true} variant="compact" />)
    const skeletons = screen.getAllByTestId('stay-skeleton')
    expect(skeletons).toHaveLength(4)

    const container = screen.getByTestId('stay-grid-loading')
    expect(container).toHaveClass('flex-col')
  })

  it('renders the empty message when no stays are provided', () => {
    render(<StayGrid stays={[]} loading={false} emptyMessage="Empty" />)
    expect(screen.getByText('Empty')).toBeInTheDocument()
  })

  it('passes the variant correctly to StayCard', () => {
    render(<StayGrid stays={mockStays} variant="compact" />)
    expect(screen.getByText(/Stay One - compact/i)).toBeInTheDocument()
  })

  it('applies grid classes for default view', () => {
    render(<StayGrid stays={mockStays} variant="default" />)
    const grid = screen.getByTestId('stay-grid')
    expect(grid).toHaveClass('grid', 'grid-cols-1', 'lg:grid-cols-3')
  })
})
