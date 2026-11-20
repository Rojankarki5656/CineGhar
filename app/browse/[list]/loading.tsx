export default function Loading() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-6">
        <div className="mb-6 h-4 w-16 rounded bg-zinc-800 animate-pulse" />
        <div className="mb-6 h-8 w-64 rounded bg-zinc-800 animate-pulse" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[2/3] rounded-md bg-zinc-800" />
              <div className="mt-2 h-3 w-4/5 rounded bg-zinc-800" />
              <div className="mt-1 h-3 w-2/5 rounded bg-zinc-800" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}