import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { Stay } from '../types'
import { StayGrid } from './StayGrid'

vi.mock('./StayCard', () => ({
  StayCard: ({ stay }: { stay: Stay }) => <div data-testid="mock-stay-card">{stay.name}</div>,
}))

describe('StayGrid', () => {
  const mockStays: Stay[] = [{ id: '1', name: 'Stay One' } as Stay]

  it('renders loading skeletons when loading is true', () => {
    render(<StayGrid stays={[]} loading={true} />)

    const skeletons = screen.getAllByTestId('stay-skeleton')
    expect(skeletons).toHaveLength(6)
    expect(skeletons[0]).toHaveClass('animate-pulse')
  })

  it('renders the empty message when no stays are provided', () => {
    render(<StayGrid stays={[]} loading={false} emptyMessage="Empty" />)
    expect(screen.getByText('Empty')).toBeInTheDocument()
  })

  it('renders a list of StayCards when stays are provided', () => {
    render(<StayGrid stays={mockStays} loading={false} />)

    const cards = screen.getAllByTestId('mock-stay-card')
    expect(cards).toHaveLength(1)
  })

  it('has the correct grid layout classes', () => {
    render(<StayGrid stays={mockStays} loading={false} />)

    const grid = screen.getByTestId('stay-grid')
    expect(grid).toHaveClass('grid', 'grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-3')
  })
})
