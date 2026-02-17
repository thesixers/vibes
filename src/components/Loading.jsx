import React from "react";

export default function Loading() {
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-bgMain pb-32 animate-pulse overflow-hidden">
      {/* HEADER SECTION SKELETON */}
      <div className="relative p-4 md:p-12 shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-end">
          
          {/* Cover Art Placeholder */}
          <div className="w-48 h-48 md:w-60 md:h-60 rounded-[2rem] md:rounded-[2.5rem] bg-surface border-4 border-white/5 shrink-0 shadow-soft" />

          {/* Info Section Placeholder */}
          <div className="flex-1 space-y-4 text-center md:text-left w-full flex flex-col items-center md:items-start">
            {/* Type Label */}
            <div className="h-4 w-20 bg-white/10 rounded-full" />

            {/* Title - Responsive Sizes */}
            <div className="h-10 md:h-20 w-3/4 md:w-2/3 bg-white/10 rounded-2xl" />

            {/* Description */}
            <div className="h-4 w-1/2 md:w-1/3 bg-white/5 rounded-full" />

            {/* Play Button Placeholder */}
            <div className="pt-2">
              <div className="h-14 w-36 md:h-16 md:w-40 bg-primary/20 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH BAR SKELETON */}
      <div className="px-4 md:px-12 py-3 md:py-4 border-b border-white/5 md:border-none">
        <div className="max-w-7xl mx-auto">
          <div className="w-full max-w-md h-12 md:h-14 bg-surface rounded-2xl border border-white/5" />
        </div>
      </div>

      {/* TRACK LIST SKELETON */}
      <div className="flex-1 px-2 md:px-12 max-w-7xl mx-auto w-full pt-4">
        {/* List Header (Desktop Only) */}
        <div className="hidden md:flex gap-4 px-6 py-4 mb-4 border-b border-white/5">
          <div className="w-8 h-3 bg-white/5 rounded" />
          <div className="w-32 h-3 bg-white/5 rounded" />
          <div className="w-24 h-3 bg-white/5 rounded ml-auto" />
        </div>

        {/* Rows */}
        <div className="space-y-2">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 md:gap-4 px-3 py-3 md:px-6 md:py-4 rounded-xl bg-surface/30 border border-transparent"
            >
              {/* Index Column */}
              <div className="w-8 md:w-10 flex justify-center shrink-0">
                <div className="w-4 h-4 bg-white/10 rounded-full" />
              </div>

              {/* Info Column (Image + Text) */}
              <div className="flex-1 flex items-center gap-3 md:gap-4 overflow-hidden">
                {/* Image */}
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-white/10 shrink-0" />
                
                {/* Text Lines */}
                <div className="flex flex-col gap-2 w-full">
                  <div className="h-4 w-32 md:w-48 bg-white/10 rounded" />
                  <div className="h-3 w-20 md:w-32 bg-white/5 rounded" />
                </div>
              </div>

              {/* Album Column (Desktop Only) */}
              <div className="hidden md:block w-1/4">
                <div className="h-3 w-24 bg-white/5 rounded" />
              </div>

              {/* Time Column (Desktop Only) */}
              <div className="hidden md:block w-16 text-right">
                <div className="h-3 w-10 bg-white/5 rounded ml-auto" />
              </div>

              {/* Actions Column Placeholder */}
              <div className="w-8 md:w-12 flex justify-end">
                <div className="w-6 h-6 bg-white/5 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}