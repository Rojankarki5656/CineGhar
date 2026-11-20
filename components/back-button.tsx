"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export function BackButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="mb-6 inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded"
    >
      <ChevronLeft className="h-4 w-4" /> Back
    </button>
  );
}