import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import type { Stay } from '../types'
import { StayCard } from './StayCard'

vi.mock('@/core/utils/formatters')

describe('StayCard', () => {
  const mockStay: Stay = {
    id: 'stay-1',
    name: 'Transylvanian Castle',
    location: 'Brașov, Romania',
    price: 1200,
    images: ['https://example.com/castle.jpg'],
    description: 'A beautiful historical castle.',
    latitude: 45.6427,
    longitude: 25.5887,
    createdAt: new Date().toISOString(),
  }

  it('renders stay information correctly', () => {
    render(
      <MemoryRouter>
        <StayCard stay={mockStay} />
      </MemoryRouter>,
    )

    expect(screen.getByText('Transylvanian Castle')).toBeInTheDocument()
    expect(screen.getByText(/Brașov, Romania/i)).toBeInTheDocument()
    expect(screen.getByText('1200 RON')).toBeInTheDocument()

    const img = screen.getByRole('img') as HTMLImageElement
    expect(img.src).toBe(mockStay.images![0])
    expect(img.alt).toBe(mockStay.name)
  })

  it('renders "No Image" placeholder when images array is empty', () => {
    const stayWithNoImage = { ...mockStay, images: [] }

    render(
      <MemoryRouter>
        <StayCard stay={stayWithNoImage} />
      </MemoryRouter>,
    )

    expect(screen.getByText(/No Image/i)).toBeInTheDocument()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('links to the correct stay details page', () => {
    render(
      <MemoryRouter>
        <StayCard stay={mockStay} />
      </MemoryRouter>,
    )

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', `/stays/${mockStay.id}`)
  })
})
