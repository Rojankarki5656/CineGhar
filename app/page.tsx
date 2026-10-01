"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Head from "next/head";

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
    <>
      <Head>
        {/* Primary Meta Tags */}
        <title>CineGhar: Watch Nepali Movies Online Free | Latest Nepali Films Streaming</title>
        <meta
          name="description"
          content="Watch the latest Nepali movies, classics, and exclusive films online for free at CineGhar. Stream HD Nepali cinema, TV shows, and more—anytime, anywhere. No signup required!" />
        <meta
          name="keywords"
          content="Nepali movies, watch Nepali movies online, free Nepali films, Nepali movie streaming, CineGhar, Nepali cinema, latest Nepali movies, Nepali TV shows, Nepali film classics, Nepali Netflix, Nepali movies HD, Nepali movies 2025, Nepali movies download, Nepali movies watch free, Nepali movies online, Nepali movies streaming, Nepali movies website, Nepali movies app, Nepali movies list, Nepali movies new release" />
        <meta name="author" content="CineGhar Nepal" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <link rel="canonical" href="https://cineghar.live/" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="CineGhar" />
        <meta property="og:url" content="https://cineghar.live/" />
        <meta property="og:title" content="CineGhar: Watch Nepali Movies Online Free | Latest Nepali Films Streaming" />
        <meta
          property="og:description"
          content="Stream the best Nepali movies and TV shows online for free. CineGhar is Nepal’s #1 movie streaming site for new releases, classics, and exclusive content." />
        <meta property="og:image" content="https://cineghar.live/og-image.jpg" />
        <meta property="og:image:alt" content="CineGhar - Nepali Movies Streaming" />
        <meta property="og:locale" content="en_NP" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@cineghar" />
        <meta name="twitter:creator" content="@cineghar" />
        <meta name="twitter:url" content="https://cineghar.live/" />
        <meta name="twitter:title" content="CineGhar: Watch Nepali Movies Online Free" />
        <meta
          name="twitter:description"
          content="Nepali movies anytime, anywhere. CineGhar.live brings Nepali cinema online — just like Netflix for Nepal." />
        <meta name="twitter:image" content="https://cineghar.live/og-image.jpg" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />

        {/* Mobile & Web App */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#000000" />

        {/* Structured Data for SEO */}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "VideoStreamingService",
              "name": "CineGhar",
              "url": "https://cineghar.live/",
              "logo": "https://cineghar.live/og-image.jpg",
              "description": "Watch the latest Nepali movies, classics, and exclusive films online for free at CineGhar. Stream HD Nepali cinema, TV shows, and more—anytime, anywhere.",
              "sameAs": [
                "https://www.facebook.com/cineghar",
                "https://twitter.com/cineghar",
                "https://www.instagram.com/cineghar"
              ]
            }
          `}
        </script>
      </Head>
      <div className="min-h-screen bg-black text-white font-sans">
        {/* Hero Section */}
        <div className="relative h-screen">
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black z-10" />
          <div className="absolute inset-0">
            {moviePosters.map((poster, index) => (
              <div
                key={index}
                className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${index === currentImageIndex ? "opacity-100" : "opacity-0"}`}
                style={{ backgroundImage: `url(${poster})` }} />
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
                    className="rounded-lg shadow-2xl w-full h-auto transition-transform hover:scale-105 duration-300" />
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
                    className="rounded-lg shadow-2xl w-full h-auto transition-transform hover:scale-105 duration-300" />
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
    </>
  );
}