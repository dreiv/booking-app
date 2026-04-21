import { MapPinOff } from 'lucide-react'
import { Link } from 'react-router'

export const NotFoundView = () => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <MapPinOff className="text-accent/40 mb-6 h-16 w-16" />

    <h1 className="text-text-h mb-2 text-6xl font-bold">404</h1>
    <p className="text-text mb-8">Oops! This destination doesn't exist.</p>

    <Link to="/" className="btn-primary">
      Return to Home
    </Link>
  </div>
)
