import type { Stay } from '../types'
import { StayCard } from './StayCard'

interface Props {
  stays: Stay[]
  loading?: boolean
  emptyMessage?: string
  variant?: 'default' | 'compact'
}

export const StayGrid: React.FC<Props> = ({
  stays,
  loading,
  emptyMessage,
  variant = 'default',
}) => {
  const isCompact = variant === 'compact'

  const gridClasses = isCompact
    ? 'flex flex-col gap-4 p-2'
    : 'grid grid-cols-1 gap-8 p-4 sm:grid-cols-2 lg:grid-cols-3'

  if (loading) {
    const skeletonCount = isCompact ? 4 : 6
    return (
      <div className={gridClasses} data-testid="stay-grid-loading">
        {[...Array(skeletonCount)].map((_, i) => (
          <div
            key={i}
            data-testid="stay-skeleton" // Added this back for the tests!
            className={`${isCompact ? 'h-32' : 'h-80'} animate-pulse rounded-2xl bg-gray-100/50`}
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
    <div className={gridClasses} data-testid="stay-grid">
      {stays.map((stay) => (
        <StayCard key={stay.id} stay={stay} variant={variant} />
      ))}
    </div>
  )
}
