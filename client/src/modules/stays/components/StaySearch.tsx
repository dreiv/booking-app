import React, { useState } from "react";
import { useSearchParams } from "react-router";

export const StaySearch: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("location") || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ location: query.trim(), page: "1" });
    } else {
      setSearchParams({});
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="w-full max-w-4xl mx-auto mb-12 px-4"
    >
      <div className="flex items-center bg-white border-2 border-gray-100 p-2 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
        <div className="flex-1 flex items-center px-4">
          <span className="text-gray-400 mr-2 text-xl">🔍</span>
          <input
            type="text"
            placeholder="Search by city (e.g. Cluj, Sinaia, Brașov...)"
            className="w-full py-4 outline-none text-gray-800 text-lg font-medium bg-transparent"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="bg-[var(--accent)] text-white px-10 py-4 rounded-xl font-bold text-lg hover:brightness-110 active:scale-95 transition-all"
        >
          Search
        </button>
      </div>
    </form>
  );
};
