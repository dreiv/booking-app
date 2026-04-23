import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import React from 'react'
import { MapContainer } from 'react-leaflet'
import type { Stay } from '../types'
import { MapContent } from './MapContent'

interface Props {
  stays: Stay[]
  isLoading: boolean
}

export const StaysMap: React.FC<Props> = ({ stays, isLoading }) => {
  // Default center (Romania) if no coordinates are in URL
  const center: L.LatLngExpression = [45.9432, 24.9668]

  return (
    <div data-testid="map-container-wrapper" className="relative h-full w-full bg-[var(--bg-card)]">
      {isLoading && (
        <div
          data-testid="map-loader"
          className="absolute inset-0 z-[1001] flex items-center justify-center bg-[var(--bg-root)]/40 backdrop-blur-[2px]"
        >
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
        </div>
      )}

      <MapContainer center={center} zoom={7} scrollWheelZoom={true} className="z-0 h-full w-full">
        <MapContent stays={stays} />
      </MapContainer>
    </div>
  )
}
