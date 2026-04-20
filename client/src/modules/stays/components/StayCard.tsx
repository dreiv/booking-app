import React from "react";
import { Link } from "react-router";
import type { Stay } from "../models";

interface Props {
  stay: Stay;
}

export const StayCard: React.FC<Props> = ({ stay }) => {
  return (
    <Link
      to={`/stays/${stay.id}`}
      className="group flex flex-col border border-[var(--border)] rounded-xl overflow-hidden hover:shadow-[var(--shadow)] transition-all duration-300"
    >
      {/* Image Placeholder */}
      <div className="aspect-[4/3] bg-[var(--code-bg)] overflow-hidden">
        {stay.images?.[0] ? (
          <img
            src={stay.images[0]}
            alt={stay.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-lg text-[var(--text-h)] leading-tight group-hover:text-[var(--accent)]">
          {stay.name}
        </h3>
        <p className="text-sm text-[var(--text)] mb-4">{stay.location}</p>

        <div className="mt-auto flex justify-between items-end">
          <div>
            <span className="text-xs text-[var(--text)] block uppercase tracking-wider font-bold">
              Price from
            </span>
            <span className="text-xl font-bold text-[var(--text-h)]">
              ${stay.price}
            </span>
          </div>
          <button className="bg-[var(--accent)] text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90">
            View Details
          </button>
        </div>
      </div>
    </Link>
  );
};
