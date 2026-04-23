import L from 'leaflet'
import { MapPin } from 'lucide-react'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { Marker, Popup, TileLayer } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import { Link } from 'react-router'
import { useMapSync } from '../hooks/useMapSync'
import type { Stay } from '../types'

// Define the icon creator
const createStayIcon = () =>
  L.divIcon({
    html: renderToString(
      <div className="relative flex items-center justify-center">
        <div className="relative text-[var(--accent)] drop-shadow-sm">
          <MapPin size={32} fill="currentColor" strokeWidth={2.5} />
          <div className="absolute top-[8px] left-[11px] h-2.5 w-2.5 rounded-full bg-white" />
        </div>
      </div>,
    ),
    className: 'custom-map-pin',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  })

interface Props {
  stays: Stay[]
}

export const MapContent: React.FC<Props> = ({ stays }) => {
  useMapSync()
  const icon = createStayIcon()

  return (
    <>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />

      <MarkerClusterGroup
        chunkedLoading
        maxClusterRadius={50}
        iconCreateFunction={(cluster) => {
          const count = cluster.getChildCount()
          return L.divIcon({
            html: `<div><span>${count}</span></div>`,
            className: 'custom-cluster',
            iconSize: L.point(40, 40),
          })
        }}
      >
        {stays.map((stay) => (
          <Marker key={stay.id} position={[stay.latitude, stay.longitude]} icon={icon}>
            <Popup>
              <div className="w-48 overflow-hidden bg-[var(--bg-card)]">
                <Link to={`/stays/${stay.id}`} className="block h-28 w-full overflow-hidden">
                  <img
                    src={stay.images[0]}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                    alt={stay.name}
                  />
                </Link>

                <div className="p-3">
                  <div className="mb-0.5 text-[10px] font-black tracking-widest text-[var(--text-p)] uppercase opacity-50">
                    {stay.location}
                  </div>
                  <h3 className="line-clamp-1 text-sm font-bold text-[var(--text-h)]">
                    {stay.name}
                  </h3>

                  <div className="mt-2 flex items-center justify-between border-t border-[var(--border)] pt-2">
                    <span className="text-sm font-black text-[var(--accent)]">
                      ${stay.price}
                      <span className="ml-1 text-[10px] font-normal opacity-60">/ night</span>
                    </span>

                    <Link
                      to={`/stays/${stay.id}`}
                      className="rounded-lg bg-[var(--accent)] px-3 py-1 text-[10px] font-bold text-white transition-all hover:brightness-110 active:scale-95"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </>
  )
}
