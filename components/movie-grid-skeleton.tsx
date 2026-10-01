// components/movie-grid-skeleton.tsx
"use client";

interface MovieGridSkeletonProps {
  count?: number;
}

export function MovieGridSkeleton({ count = 18 }: MovieGridSkeletonProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="relative aspect-[2/3] rounded-md overflow-hidden bg-zinc-800" />
          <div className="mt-2 h-4 w-4/5 rounded bg-zinc-800" />
          <div className="mt-1 h-3 w-2/5 rounded bg-zinc-800" />
        </div>
      ))}
    </div>
  );
}