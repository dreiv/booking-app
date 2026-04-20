import { formatCurrency } from "@/core/utils/formatters";
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
      className="group flex flex-col border border-[var(--border)] rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-[var(--card-bg,transparent)]"
    >
      {/* Image Container */}
      <div className="aspect-[4/3] bg-[var(--code-bg)] overflow-hidden relative">
        {stay.images?.[0] ? (
          <img
            src={stay.images[0]}
            alt={stay.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[var(--text-muted)]">
            No Image
          </div>
        )}

        <div className="absolute top-3 left-3 bg-[var(--bg)]/80 backdrop-blur-sm px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm text-[var(--text)]">
          Featured
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-4">
          <h3 className="font-bold text-lg text-[var(--text-h)] leading-tight group-hover:text-[var(--accent)] transition-colors line-clamp-1">
            {stay.name}
          </h3>
          <p className="text-sm text-[var(--text)] opacity-70 mt-1 flex items-center gap-1">
            <span className="i-lucide-map-pin w-3 h-3" /> {stay.location}
          </p>
        </div>

        <div className="mt-auto pt-4 border-t border-[var(--border)] flex justify-between items-center">
          <div>
            <p className="text-[10px] text-[var(--text)] opacity-50 uppercase font-black tracking-widest">
              Per Night
            </p>
            <p className="text-xl font-black text-[var(--accent)]">
              {formatCurrency(stay.price)}
            </p>
          </div>

          <div className="bg-[var(--border)] p-2 rounded-lg group-hover:bg-[var(--accent)] group-hover:text-white transition-all text-[var(--text-h)]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
};
