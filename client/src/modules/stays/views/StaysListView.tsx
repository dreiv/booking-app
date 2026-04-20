import React from "react";
import { useSearchParams } from "react-router";
import { StayCard } from "../components/StayCard";
import { StaySearch } from "../components/StaySearch";
import { useStays } from "../hooks/useStays";

export const StaysListView: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const location = searchParams.get("location") || "";
  const limit = 9;

  const { data, isLoading, isError, error, isPlaceholderData } = useStays({
    page,
    limit,
    location,
  });

  const updateParams = (newParams: Record<string, string | number>) => {
    const current = Object.fromEntries(searchParams.entries());

    const merged = { ...current, ...newParams };
    const stringifiedParams: Record<string, string> = {};

    Object.entries(merged).forEach(([key, value]) => {
      stringifiedParams[key] = String(value);
    });

    setSearchParams(stringifiedParams);
  };

  if (isError)
    return (
      <div className="p-20 text-center text-red-500 font-bold">
        Error: {error?.message}
      </div>
    );

  const stays = data?.data || [];
  const meta = data?.meta;

  return (
    <section className="container-root py-6">
      <StaySearch />

      <div
        className={`transition-opacity duration-300 ${isPlaceholderData ? "opacity-50" : "opacity-100"}`}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-4 mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              {location ? `Available in ${location}` : "Explore trending stays"}
            </h2>
            {location && (
              <button
                onClick={() => setSearchParams({})}
                className="text-sm font-bold text-[var(--accent)] hover:underline mt-1"
              >
                ← Show all destinations
              </button>
            )}
          </div>

          {meta && (
            <span className="text-sm font-bold px-4 py-2 bg-purple-50 text-[var(--accent)] rounded-full border border-purple-100">
              {stays.length} of {meta.totalCount} results
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-96 bg-gray-100 animate-pulse rounded-3xl"
              />
            ))}
          </div>
        ) : stays.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
            {stays.map((stay) => (
              <StayCard key={stay.id} stay={stay} />
            ))}
          </div>
        ) : (
          <div className="py-32 text-center bg-gray-50 rounded-3xl mx-4">
            <p className="text-2xl text-gray-400 font-medium">
              No results for "{location}"
            </p>
            <p className="text-gray-500 mt-2">
              Try searching for another city or clear the filter.
            </p>
          </div>
        )}

        {meta && meta.totalPages > 1 && (
          <div className="flex justify-center items-center gap-6 mt-16 pb-20">
            <button
              onClick={() => updateParams({ page: Math.max(page - 1, 1) })}
              disabled={page === 1}
              className="w-32 py-3 border-2 border-gray-200 rounded-2xl font-bold hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-30 disabled:hover:border-gray-200 disabled:hover:text-inherit transition-all"
            >
              Previous
            </button>

            <div className="flex items-center gap-2">
              <span className="text-white w-10 h-10 flex items-center justify-center rounded-xl font-bold ">
                {page}
              </span>
              <span className="text-gray-400 font-bold mx-1">/</span>
              <span className="text-gray-700 font-bold">{meta.totalPages}</span>
            </div>

            <button
              onClick={() => updateParams({ page: page + 1 })}
              disabled={!meta.hasNextPage}
              className="w-32 py-3 border-2 border-gray-200 rounded-2xl font-bold hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-30 disabled:hover:border-gray-200 disabled:hover:text-inherit transition-all"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
