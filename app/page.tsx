"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const moviePosters = [
    "https://i.ytimg.com/vi/1WajDWLXuVU/maxresdefault.jpg",
    "https://i.ytimg.com/vi/Vhf7rS3T_tg/maxresdefault.jpg",
    "https://i.ytimg.com/vi/g1sML8y5yIk/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLC039maYrS3GVG791IJkxw1XGvzAg",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % moviePosters.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [moviePosters.length]);

  const handleGetStarted = () => {
    router.push("/home");
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Hero Section */}
      <div className="relative h-screen">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black z-10" />
        <div className="absolute inset-0">
          {moviePosters.map((poster, index) => (
            <div
              key={index}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
                index === currentImageIndex ? "opacity-100" : "opacity-0"
              }`}
              style={{ backgroundImage: `url(${poster})` }}
            />
          ))}
        </div>

        <header className="relative z-20 flex items-center justify-between p-4 md:p-6">
          <div className="flex items-center">
            <Link href="/">
              <h1 className="text-2xl md:text-3xl font-bold text-red-600 transition-transform hover:scale-105">
                CineGhar
              </h1>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button
                variant="ghost"
                className="text-white hover:text-white hover:bg-red-600/30 transition-all duration-300 text-lg"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </header>

        <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4 md:px-6 animate-fade-in">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
            Unlimited Nepali Movies, TV Shows, and More
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl">
            Discover the best of Nepali entertainment. Watch anywhere, anytime.
          </p>
          <p className="text-lg md:text-xl mb-10 text-gray-300 max-w-2xl">
            Ready to dive in? Join CineGhar today and start streaming.
          </p>
          <Button
            onClick={handleGetStarted}
            className="bg-red-600 hover:bg-red-700 text-white px-10 py-6 text-lg md:text-xl rounded-md flex items-center gap-2 transition-all duration-300 hover:scale-105"
          >
            Get Started <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Feature Section 1: Enjoy on Your TV */}
      <section className="py-20 px-4 md:px-6 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16 animate-slide-up">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                Stream on Any TV
              </h2>
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
                Enjoy CineGhar on Smart TVs, PlayStation, Xbox, Chromecast, Apple TV, Blu-ray players, and more.
              </p>
            </div>
            <div className="flex-1">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Smart TV streaming CineGhar"
                  className="rounded-lg shadow-2xl w-full h-auto transition-transform hover:scale-105 duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section 2: Offline Viewing */}
      <section className="py-20 px-4 md:px-6 bg-zinc-900">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row-reverse items-center gap-12 md:gap-16 animate-slide-up">
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                Watch Offline Anytime
              </h2>
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
                Download your favorite Nepali movies and shows to enjoy on the go, no internet required.
              </p>
            </div>
            <div className="flex-1">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Mobile device downloading CineGhar content"
                  className="rounded-lg shadow-2xl w-full h-auto transition-transform hover:scale-105 duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="py-20 px-4 md:px-6 bg-black border-t border-zinc-800">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join CineGhar Today
          </h2>
          <p className="text-lg md:text-xl text-gray-300 mb-10">
            Start streaming the best Nepali entertainment with a subscription that fits your needs.
          </p>
          <Button
            onClick={handleGetStarted}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg rounded-md transition-all duration-300 hover:scale-105"
          >
            Start Watching Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 md:px-6 bg-black text-gray-400 border-t border-zinc-800">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <Link href="/">
              <h2 className="text-xl font-bold text-red-600 mb-4 hover:text-red-500 transition-colors">
                CineGhar
              </h2>
            </Link>
            <p className="text-gray-400">
              Questions?{" "}
              <Link href="/contact" className="hover:underline text-gray-300">
                Contact us
              </Link>
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <ul className="space-y-3">
                <li>
                  <Link href="/faq" className="hover:underline text-gray-300">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/investor-relations" className="hover:underline text-gray-300">
                    Investor Relations
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:underline text-gray-300">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/speed-test" className="hover:underline text-gray-300">
                    Speed Test
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <ul className="space-y-3">
                <li>
                  <Link href="/help-center" className="hover:underline text-gray-300">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/jobs" className="hover:underline text-gray-300">
                    Jobs
                  </Link>
                </li>
                <li>
                  <Link href="/cookie-preferences" className="hover:underline text-gray-300">
                    Cookie Preferences
                  </Link>
                </li>
                <li>
                  <Link href="/legal-notices" className="hover:underline text-gray-300">
                    Legal Notices
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <ul className="space-y-3">
                <li>
                  <Link href="/account" className="hover:underline text-gray-300">
                    Account
                  </Link>
                </li>
                <li>
                  <Link href="/ways-to-watch" className="hover:underline text-gray-300">
                    Ways to Watch
                  </Link>
                </li>
                <li>
                  <Link href="/corporate-info" className="hover:underline text-gray-300">
                    Corporate Information
                  </Link>
                </li>
                <li>
                  <Link href="/exclusives" className="hover:underline text-gray-300">
                    Only on CineGhar
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <ul className="space-y-3">
                <li>
                  <Link href="/media-center" className="hover:underline text-gray-300">
                    Media Center
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:underline text-gray-300">
                    Terms of Use
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:underline text-gray-300">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-10 text-sm text-gray-500">
            <p>© 2025 CineGhar Nepal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}