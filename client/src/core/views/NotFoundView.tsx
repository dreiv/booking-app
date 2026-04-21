import { Link } from 'react-router'

export const NotFoundView = () => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <h1 className="mb-4 text-4xl font-bold">404</h1>
    <p className="mb-8 text-[var(--text)]">Oops! This destination doesn't exist.</p>

    <Link to="/" className="font-medium text-[var(--accent)] hover:underline">
      Return to Home
    </Link>
  </div>
)
