"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function BrowseError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-bold mb-2">Couldn't load this list</h1>
        <p className="text-gray-400 mb-6 break-words">{error.message}</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="rounded-md border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-900"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-md border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-900"
          >
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}