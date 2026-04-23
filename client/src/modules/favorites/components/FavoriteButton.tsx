import { Heart } from 'lucide-react'
import React from 'react'
import { useFavorites } from '../hooks/useFavorites'

interface FavoriteButtonProps {
  stayId: string
  className?: string
  iconSize?: number
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  stayId,
  className = '',
  iconSize = 24,
}) => {
  const favoriteIds = useFavorites((state) => state.favoriteIds)
  const toggleFavorite = useFavorites((state) => state.toggleFavorite)

  const isFav = favoriteIds.includes(stayId)

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(stayId)
  }

  return (
    <button
      onClick={handleToggle}
      type="button"
      aria-pressed={isFav}
      aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
      className={`flex items-center justify-center transition-all focus:outline-none active:scale-90 ${className}`}
    >
      <Heart
        data-testid="heart-icon"
        size={iconSize}
        className={`transition-colors duration-300 ${
          isFav
            ? 'fill-[var(--accent)] text-[var(--accent)]'
            : 'text-neutral-400 hover:text-[var(--accent)]'
        }`}
        strokeWidth={isFav ? 1.5 : 2}
      />
    </button>
  )
}
