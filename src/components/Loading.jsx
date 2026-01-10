import React from "react";

export default function Loading() {
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-gradient-to-b from-[#1e1e1e] to-black pb-32 p-6 md:p-8 space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row items-center md:items-end gap-8 mt-4">
        {/* Cover Art Placeholder */}
        <div className="w-52 h-52 md:w-60 md:h-60 bg-white/5 rounded-xl shadow-lg flex-shrink-0" />

        <div className="flex-1 w-full space-y-4 pb-2">
          {/* Type & Title */}
          <div className="h-4 w-20 bg-white/10 rounded-full mx-auto md:mx-0" />
          <div className="h-12 md:h-20 w-3/4 bg-white/10 rounded-lg mx-auto md:mx-0" />

          {/* Description & Stats */}
          <div className="h-4 w-1/2 bg-white/5 rounded-full mx-auto md:mx-0" />
          <div className="flex justify-center md:justify-start gap-3 pt-2">
            <div className="h-4 w-24 bg-white/5 rounded-full" />
            <div className="h-4 w-24 bg-white/5 rounded-full" />
          </div>
        </div>
      </div>

      {/* Action Bar Skeleton */}
      <div className="flex gap-6">
        <div className="w-14 h-14 rounded-full bg-white/10" />
      </div>

      {/* Track List Skeleton */}
      <div className="space-y-2">
        {/* Header Row */}
        <div className="flex gap-4 px-4 py-2 border-b border-white/5">
          <div className="w-10 h-4 bg-white/5 rounded" />
          <div className="w-40 h-4 bg-white/5 rounded" />
        </div>

        {/* Fake Rows */}
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3">
            <div className="w-10 h-4 bg-white/5 rounded mx-auto" /> {/* # */}
            <div className="w-10 h-10 bg-white/5 rounded flex-shrink-0" />{" "}
            {/* Image */}
            <div className="flex-1 space-y-2">
              <div className="h-4 w-40 bg-white/10 rounded" /> {/* Title */}
              <div className="h-3 w-24 bg-white/5 rounded" /> {/* Artist */}
            </div>
            <div className="hidden md:block w-1/4 h-4 bg-white/5 rounded" />{" "}
            {/* Album */}
            <div className="w-10 h-4 bg-white/5 rounded" /> {/* Time */}
          </div>
        ))}
      </div>
    </div>
  );
}
