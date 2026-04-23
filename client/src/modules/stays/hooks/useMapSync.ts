import { useRef } from 'react'
import { useMapEvents } from 'react-leaflet'
import { useSearchParams } from 'react-router'

export const useMapSync = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const map = useMapEvents({
    moveend: () => {
      if (timerRef.current) clearTimeout(timerRef.current)

      timerRef.current = setTimeout(() => {
        const bounds = map.getBounds()
        const nw = bounds.getNorthWest()
        const se = bounds.getSouthEast()

        const newParams = new URLSearchParams(searchParams)
        newParams.set('nwLat', nw.lat.toFixed(6))
        newParams.set('nwLng', nw.lng.toFixed(6))
        newParams.set('seLat', se.lat.toFixed(6))
        newParams.set('seLng', se.lng.toFixed(6))
        newParams.set('page', '1') // Reset pagination on move

        setSearchParams(newParams)
      }, 400)
    },
  })

  return map
}
