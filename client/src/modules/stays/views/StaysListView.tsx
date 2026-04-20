import React, { useState } from "react";
import { StayCard } from "../components/StayCard";
import { useStays } from "../hooks/useStays";

export const StaysListView: React.FC = () => {
  const [page, setPage] = useState(1);
  const limit = 9;

  const { data, isLoading, isError, error, isPlaceholderData } = useStays({
    page,
    limit,
  });

  if (isLoading) return <div className="p-8 text-center">Loading...</div>;
  if (isError) return <div>Error: {error?.message}</div>;

  const stays = data?.data || [];
  const meta = data?.meta;

  return (
    <section
      className={`py-6 transition-opacity ${isPlaceholderData ? "opacity-50" : "opacity-100"}`}
    >
      <div className="flex justify-between items-center px-4 mb-6">
        <h2 className="text-2xl font-bold">Trending destinations</h2>
        {meta && (
          <span className="text-sm text-gray-500">
            Showing {stays.length} of {meta.totalCount} stays
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {stays.map((stay) => (
          <StayCard key={stay.id} stay={stay} />
        ))}
      </div>

      {meta && meta.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-12 pb-10">
          <button
            onClick={() => setPage((old) => Math.max(old - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 border rounded-md disabled:opacity-30"
          >
            Previous
          </button>

          <span className="px-4 font-medium">
            Page {page} of {meta.totalPages}
          </span>

          <button
            onClick={() => setPage((old) => (meta.hasNextPage ? old + 1 : old))}
            disabled={!meta.hasNextPage}
            className="px-4 py-2 border rounded-md disabled:opacity-30"
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
};
