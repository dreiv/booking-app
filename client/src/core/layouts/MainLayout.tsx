import { CalendarDays } from 'lucide-react'
import { Link, Outlet } from 'react-router'

export const MainLayout = () => (
  <div className="bg-bg text-text duration-normal flex min-h-screen flex-col transition-colors">
    <header className="border-border bg-bg/80 sticky top-0 z-50 border-b py-4 backdrop-blur-md">
      <div className="layout-container flex items-center justify-between">
        <Link
          to="/"
          className="text-accent text-2xl font-bold tracking-tighter transition-opacity hover:opacity-90"
        >
          Stay<span className="text-text-h">Easy</span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            to="/my-bookings"
            className="group text-text hover:text-accent flex items-center gap-2 font-medium transition-colors"
          >
            <CalendarDays className="text-text group-hover:text-accent h-5 w-5 transition-colors" />
            <span>My Bookings</span>
          </Link>
        </nav>
      </div>
    </header>

    <main className="layout-container flex-grow py-8">
      <Outlet />
    </main>

    <footer className="border-border bg-bg mt-12 border-t py-8">
      <div className="layout-container text-center text-sm opacity-70">
        &copy; {new Date().getFullYear()} StayEasy. Built for the booking challenge.
      </div>
    </footer>
  </div>
)
