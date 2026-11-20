// app/movies/[id]/not-found.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="text-3xl md:text-4xl font-bold">Movie not found</h1>
      <p className="text-gray-400 max-w-md">
        We couldn&apos;t find that title. It may have been removed, or the link
        is incorrect.
      </p>
      <Link href="/">
        <Button className="bg-red-600 hover:bg-red-700 text-white">
          Back to Home
        </Button>
      </Link>
    </div>
  );
}