"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Info, Play, Star, ChevronLeft, ChevronRight } from "lucide-react";

export interface HeroSlide {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  year?: string;
  duration?: string;
  rating?: string;
  badge?: string;
}

interface HeroBannerProps {
  slides: HeroSlide[];
  interval?: number;
  /** Show skeleton while slides are loading */
  loading?: boolean;
}

export function HeroBanner({
  slides,
  interval = 7000,
  loading = false,
}: HeroBannerProps) {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const total = slides.length;

  const goTo = useCallback(
    (next: number) => {
      if (total === 0) return;
      setIndex(((next % total) + total) % total);
    },
    [total],
  );

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    if (interval <= 0 || isPaused || total <= 1) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % total), interval);
    return () => clearInterval(timer);
  }, [interval, isPaused, total]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 50) (delta < 0 ? next : prev)();
    touchStartX.current = null;
  };

  /* ---------- Skeleton ---------- */
  if (loading && total === 0) {
    return (
      <div className="relative h-[70vh] min-h-[500px] w-full overflow-hidden bg-zinc-900 animate-pulse">
        {/* Background shimmer */}
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900" />

        {/* Gradient overlays to match real banner */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />

        {/* Fake text block */}
        <div className="relative z-20 h-full flex flex-col justify-end p-6 md:p-12 max-w-3xl">
          <div className="h-6 w-24 rounded bg-zinc-800 mb-3" />
          <div className="h-10 md:h-14 w-3/4 rounded bg-zinc-800 mb-3" />
          <div className="h-4 w-1/3 rounded bg-zinc-800 mb-4" />
          <div className="h-4 w-full max-w-xl rounded bg-zinc-800 mb-2" />
          <div className="h-4 w-5/6 max-w-lg rounded bg-zinc-800 mb-6" />
          <div className="flex gap-4">
            <div className="h-10 w-28 rounded bg-zinc-800" />
            <div className="h-10 w-32 rounded bg-zinc-800" />
          </div>
        </div>
      </div>
    );
  }

  if (total === 0) return null;

  return (
    <div
      className="relative h-[70vh] min-h-[500px] w-full overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured movies"
    >
      {slides.map((slide, i) => {
        const isActive = i === index;
        return (
          <div
            key={`${slide.id}-${i}`}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              isActive
                ? "opacity-100 z-10"
                : "opacity-0 z-0 pointer-events-none"
            }`}
            aria-hidden={!isActive}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${total}`}
          >
            <Image
              src={slide.imageUrl || "/placeholder.svg"}
              alt={`${slide.title} backdrop`}
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg";
              }}
            />

            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />

            <div className="relative z-20 h-full flex flex-col justify-end p-6 md:p-12 max-w-3xl">
              {slide.badge && (
                <span className="inline-block mb-3 w-fit text-xs font-semibold uppercase tracking-wider bg-red-600 text-white px-2 py-1 rounded">
                  {slide.badge}
                </span>
              )}

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3 drop-shadow-lg line-clamp-2">
                {slide.title}
              </h1>

              {(slide.year || slide.duration || slide.rating) && (
                <div className="flex items-center gap-3 mb-4 text-sm md:text-base text-gray-300">
                  {slide.year && <span>{slide.year}</span>}
                  {slide.year && slide.duration && (
                    <span className="w-1 h-1 rounded-full bg-gray-500" />
                  )}
                  {slide.duration && <span>{slide.duration}</span>}
                  {slide.duration && slide.rating && (
                    <span className="w-1 h-1 rounded-full bg-gray-500" />
                  )}
                  {slide.rating && slide.rating !== "—" && (
                    <span className="flex items-center">
                      <Star className="w-4 h-4 mr-1 text-yellow-500 fill-yellow-500" />
                      {slide.rating}
                    </span>
                  )}
                </div>
              )}

              {slide.description && (
                <p className="text-gray-300 mb-6 line-clamp-3 md:line-clamp-4 text-sm md:text-base lg:text-lg">
                  {slide.description}
                </p>
              )}

              <div className="flex flex-wrap gap-4">
                <Link href={`/watch/${slide.id}`}>
                  <Button
                    className="bg-red-600 hover:bg-red-700 text-white gap-2"
                    aria-label={`Play ${slide.title}`}
                  >
                    <Play className="w-5 h-5 fill-white" />
                    Play
                  </Button>
                </Link>
                <Link href={`/movies/${slide.id}`}>
                  <Button
                    variant="outline"
                    className="gap-2 border-white/40 hover:bg-white/10 text-black"
                    aria-label={`More info about ${slide.title}`}
                  >
                    <Info className="w-5 h-5" />
                    More Info
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        );
      })}

      {total > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition opacity-0 md:opacity-100"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={next}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition opacity-0 md:opacity-100"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {total > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index}
              className={`h-2 rounded-full transition-all ${
                i === index
                  ? "w-6 bg-red-600"
                  : "w-2 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      )}

      {total > 1 && interval > 0 && !isPaused && (
        <div className="absolute bottom-0 left-0 z-30 h-[3px] w-full bg-white/10">
          <div
            key={index}
            className="h-full bg-red-600 origin-left"
            style={{ animation: `hero-progress ${interval}ms linear forwards` }}
          />
        </div>
      )}

      <style jsx>{`
        @keyframes hero-progress {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }
      `}</style>
    </div>
  );
}