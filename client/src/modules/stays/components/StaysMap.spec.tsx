import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { Stay } from '../types'
import { StaysMap } from './StaysMap'

vi.mock('./MapContent', () => ({
  MapContent: () => <div data-testid="map-content" />,
}))

vi.mock('leaflet/dist/leaflet.css', () => ({}))

const mockStays: Stay[] = [
  {
    id: '1',
    name: 'Transylvania Castle',
    latitude: 45.1,
    longitude: 25.1,
    images: [],
    price: 100,
    location: 'Bran',
  },
] as any

describe('StaysMap', () => {
  it('renders the MapContainer and MapContent when loaded', () => {
    render(<StaysMap stays={mockStays} isLoading={false} />)

    expect(screen.getByTestId('map-content')).toBeInTheDocument()

    const loader = screen.queryByTestId('map-loader')
    expect(loader).not.toBeInTheDocument()
  })

  it('has the correct base container classes for layout', () => {
    render(<StaysMap stays={[]} isLoading={false} />)
    const wrapper = screen.getByTestId('map-container-wrapper')

    expect(wrapper).toHaveClass('relative', 'h-full', 'w-full')
  })
})
