import type { Stay } from '../types'
import { StayCard } from './StayCard'

interface Props {
  stays: Stay[]
  loading?: boolean
  emptyMessage?: string
}
export const StayGrid: React.FC<Props> = ({ stays, loading, emptyMessage }) => {
  if (loading) {
    return (
      <div
        className="grid grid-cols-1 gap-8 p-4 sm:grid-cols-2 lg:grid-cols-3"
        data-testid="stay-grid-loading"
      >
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            data-testid="stay-skeleton"
            className="h-80 animate-pulse rounded-3xl bg-gray-100"
          />
        ))}
      </div>
    )
  }

  if (stays.length === 0) {
    return (
      <div className="py-20 text-center opacity-50">
        <p className="text-xl font-medium">{emptyMessage || 'No stays found.'}</p>
      </div>
    )
  }

  return (
    <div
      className="grid grid-cols-1 gap-8 p-4 sm:grid-cols-2 lg:grid-cols-3"
      data-testid="stay-grid"
    >
      {stays.map((stay) => (
        <StayCard key={stay.id} stay={stay} />
      ))}
    </div>
  )
}
