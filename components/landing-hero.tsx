"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function LandingHero({ posters }: { posters: string[] }) {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % posters.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [posters.length]);

  return (
    <div className="relative h-screen">
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black z-10" />

      <div className="absolute inset-0" aria-hidden="true">
        {posters.map((poster, index) => (
          <div
            key={poster}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundImage: `url(${poster})` }}
          />
        ))}
      </div>

      <header className="relative z-20 flex items-center justify-between p-4 md:p-6">
        <Link href="/" aria-label="CineGhar home">
          <h1 className="text-2xl md:text-3xl font-bold text-red-600 transition-transform hover:scale-105">
            CineGhar
          </h1>
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/login">
            <Button
              variant="ghost"
              className="text-white hover:text-white hover:bg-red-600/30 transition-all duration-300 text-lg"
            >
              Sign In
            </Button>
          </Link>
        </nav>
      </header>

      <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4 md:px-6 animate-fade-in">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
          Unlimited Nepali Movies, Anytime
        </h2>
        <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl">
          Discover the best of Nepali cinema. Watch anywhere, on any device.
        </p>
        <p className="text-lg md:text-xl mb-10 text-gray-300 max-w-2xl">
          Ready to dive in? Join CineGhar today and start streaming.
        </p>
        <Button
          onClick={() => router.push("/home")}
          className="bg-red-600 hover:bg-red-700 text-white px-10 py-6 text-lg md:text-xl rounded-md flex items-center gap-2 transition-all duration-300 hover:scale-105"
        >
          Get Started <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}