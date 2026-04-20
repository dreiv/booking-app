import { Link, Outlet } from "react-router";

export const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-[var(--border)] py-4 bg-[var(--bg)] sticky top-0 z-50">
        <div className="max-w-[1280px] mx-auto px-4 flex justify-between items-center">
          <Link
            to="/"
            className="text-2xl font-bold text-[var(--accent)] tracking-tighter"
          >
            STAY<span className="text-[var(--text-h)]">FINDER</span>
          </Link>
          <nav className="flex gap-6 text-sm font-medium">
            <Link
              to="/"
              className="hover:text-[var(--accent)] transition-colors"
            >
              Find Stays
            </Link>
            <Link
              to="/my-bookings"
              className="hover:text-[var(--accent)] transition-colors"
            >
              My Bookings
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-grow max-w-[1280px] mx-auto w-full px-4">
        <Outlet />
      </main>

      <footer className="border-t border-[var(--border)] py-8 mt-12 bg-[var(--social-bg)]">
        <div className="max-w-[1280px] mx-auto px-4 text-center text-sm text-[var(--text)]">
          &copy; 2026 StayFinder. Built for the booking challenge.
        </div>
      </footer>
    </div>
  );
};
