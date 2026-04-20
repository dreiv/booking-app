import { Link } from "react-router";

export const NotFoundView = () => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <h1 className="text-4xl font-bold mb-4">404</h1>
    <p className="mb-8 text-[var(--text)]">
      Oops! This destination doesn't exist.
    </p>

    <Link to="/" className="text-[var(--accent)] font-medium hover:underline">
      Return to Home
    </Link>
  </div>
);
