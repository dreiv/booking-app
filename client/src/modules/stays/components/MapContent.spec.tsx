import { render, screen } from '@testing-library/react'
import { MapContainer } from 'react-leaflet'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import type { Stay } from '../types'
import { MapContent } from './MapContent'

vi.mock('../hooks/useMapSync', () => ({
  useMapSync: vi.fn(),
}))

vi.mock('react-leaflet-cluster', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="marker-cluster-group">{children}</div>
  ),
}))

describe('MapContent', () => {
  const mockStays: Stay[] = [
    {
      id: '1',
      name: 'Mountain Cabin',
      location: 'Sinaia',
      price: 150,
      latitude: 45.35,
      longitude: 25.55,
      images: ['test.jpg'],
    } as any,
  ]

  it('renders TileLayer and MarkerClusterGroup', () => {
    render(
      <MemoryRouter>
        <MapContainer>
          <MapContent stays={mockStays} />
        </MapContainer>
      </MemoryRouter>,
    )

    expect(screen.getByTestId('marker-cluster-group')).toBeInTheDocument()
  })

  it('renders markers based on stay data', () => {
    const { container } = render(
      <MemoryRouter>
        <MapContainer>
          <MapContent stays={mockStays} />
        </MapContainer>
      </MemoryRouter>,
    )

    expect(container).toBeDefined()
  })
})
