import { useFavorites } from '@/modules/favorites/hooks/useFavorites'
import { CalendarDays, Heart } from 'lucide-react'
import { Link, Outlet } from 'react-router'

export const MainLayout = () => {
  const favoriteCount = useFavorites((state) => state.favoriteIds.length)

  return (
    <div className="bg-bg text-text flex min-h-screen flex-col transition-colors duration-300">
      <header className="border-border bg-bg/80 sticky top-0 z-50 border-b py-4 backdrop-blur-md">
        <div className="layout-container flex items-center justify-between px-4 sm:px-6">
          <Link
            to="/"
            className="text-accent shrink-0 text-2xl font-bold tracking-tighter transition-opacity hover:opacity-90"
          >
            Stay<span className="text-text-h">Easy</span>
          </Link>

          <nav className="flex items-center gap-5 sm:gap-8">
            <Link
              to="/favorites"
              className="group hover:text-accent flex items-center gap-2 font-medium transition-colors"
            >
              <div className="relative flex items-center justify-center">
                <Heart className="h-6 w-6 sm:h-5 sm:w-5" />
                {favoriteCount > 0 && (
                  <span className="bg-accent absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold text-white shadow-sm">
                    {favoriteCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:block">Favorites</span>
            </Link>

            <Link
              to="/bookings"
              className="group hover:text-accent flex items-center gap-2 font-medium transition-colors"
            >
              <div className="flex items-center justify-center">
                <CalendarDays className="h-6 w-6 sm:h-5 sm:w-5" />
              </div>
              <span className="hidden sm:block">My Bookings</span>
            </Link>
          </nav>
        </div>
      </header>

      <main className="layout-container flex-grow px-4 py-8 sm:px-6">
        <Outlet />
      </main>

      <footer className="border-border bg-bg mt-12 border-t py-8">
        <div className="layout-container text-center text-sm opacity-60">
          &copy; {new Date().getFullYear()} StayEasy.
        </div>
      </footer>
    </div>
  )
}
