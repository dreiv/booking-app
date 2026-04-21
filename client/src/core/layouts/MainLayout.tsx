import { Link, Outlet } from 'react-router'

export const MainLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg)] py-4">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-4">
          <Link to="/" className="text-2xl font-bold tracking-tighter text-[var(--accent)]">
            STAY<span className="text-[var(--text-h)]">FINDER</span>
          </Link>

          <nav className="flex items-center gap-6">
            <Link
              to="/my-bookings"
              className="flex items-center gap-2 font-bold text-gray-600 transition-colors hover:text-[var(--accent)]"
            >
              My Bookings
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1280px] flex-grow px-4">
        <Outlet />
      </main>

      <footer className="mt-12 border-t border-[var(--border)] bg-[var(--social-bg)] py-8">
        <div className="mx-auto max-w-[1280px] px-4 text-center text-sm text-[var(--text)]">
          &copy; 2026 StayFinder. Built for the booking challenge.
        </div>
      </footer>
    </div>
  )
}
