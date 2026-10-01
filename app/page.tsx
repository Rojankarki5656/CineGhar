// app/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Film, Shield, Zap } from "lucide-react";
import LandingHero from "@/components/landing-hero";
import LandingGetStarted from "@/components/landing-get-started";

const SITE_URL = "https://cine-ghar.vercel.app";
const SITE_NAME = "CineGhar";
const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

export const metadata: Metadata = {
  title: {
    default:
      "CineGhar — Watch Nepali Movies Online Free | Latest Nepali Films",
    template: "%s | CineGhar",
  },
  description:
    "Stream the latest Nepali movies, classics, and exclusive films online for free on CineGhar. Discover HD Nepali cinema — no signup required. We do not host any files; all content is embedded from third-party providers.",
  keywords: [
    "Nepali movies",
    "watch Nepali movies online",
    "Nepali films free",
    "Nepali movie streaming",
    "CineGhar",
    "Nepali cinema",
    "latest Nepali movies",
    "Nepali films HD",
    "Nepali movies 2025",
    "watch Nepali movies",
  ],
  authors: [{ name: "CineGhar Nepal" }],
  creator: "CineGhar Nepal",
  publisher: "CineGhar Nepal",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    url: SITE_URL,
    title: "CineGhar — Watch Nepali Movies Online Free",
    description:
      "Stream the best Nepali movies online for free. CineGhar is a search engine for Nepali cinema — we don't host any files, we only embed publicly available content.",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "CineGhar — Nepali Movies Streaming",
      },
    ],
    locale: "en_NP",
  },
  twitter: {
    card: "summary_large_image",
    site: "@cineghar",
    creator: "@cineghar",
    title: "CineGhar — Watch Nepali Movies Online Free",
    description:
      "Nepali movies anytime, anywhere. CineGhar brings Nepali cinema online.",
    images: [OG_IMAGE],
  },
  icons: {
    icon: "/favicon.ico",
  },
  themeColor: "#000000",
  viewport: "width=device-width, initial-scale=1.0",
};

const moviePosters = [
  "https://i.ytimg.com/vi/1WajDWLXuVU/maxresdefault.jpg",
  "https://i.ytimg.com/vi/Vhf7rS3T_tg/maxresdefault.jpg",
  "https://i.ytimg.com/vi/g1sML8y5yIk/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLC039maYrS3GVG791IJkxw1XGvzAg",
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description:
        "CineGhar is a free Nepali movie discovery and streaming portal. We do not host any files — all content is embedded from third-party providers.",
      inLanguage: "en-NP",
      publisher: { "@id": `${SITE_URL}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: OG_IMAGE,
      },
      sameAs: [
        "https://www.facebook.com/cineghar",
        "https://twitter.com/cineghar",
        "https://www.instagram.com/cineghar",
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "Does CineGhar host or store movie files?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. CineGhar does not host, upload, or store any video files on its servers. We only embed publicly available content from third-party providers. All trademarks and copyrights belong to their respective owners.",
          },
        },
        {
          "@type": "Question",
          name: "Is CineGhar free to use?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. CineGhar is a free Nepali movie discovery platform. You can browse and stream without a subscription.",
          },
        },
        {
          "@type": "Question",
          name: "What content is available on CineGhar?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "CineGhar indexes Nepali movies, classics, and selected regional films. Our library focuses on Nepali cinema.",
          },
        },
      ],
    },
  ],
};

export default function LandingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="min-h-screen bg-black text-white font-sans">
        {/* ==== HERO ==== */}
        <LandingHero posters={moviePosters} />

        {/* ==== FEATURES ==== */}
        <section
          aria-labelledby="features-heading"
          className="py-20 px-4 md:px-6 bg-black"
        >
          <div className="max-w-6xl mx-auto">
            <h2
              id="features-heading"
              className="text-3xl md:text-4xl font-bold text-center mb-14"
            >
              Why CineGhar
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <article className="bg-zinc-900 rounded-lg p-6 border border-zinc-800 hover:border-zinc-700 transition">
                <Film className="w-10 h-10 text-red-500 mb-4" />
                <h3 className="text-xl font-semibold mb-3">
                  A Curated Nepali Library
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Browse a growing collection of Nepali films — from classics
                  to recent releases — all in one place.
                </p>
              </article>

              <article className="bg-zinc-900 rounded-lg p-6 border border-zinc-800 hover:border-zinc-700 transition">
                <Zap className="w-10 h-10 text-red-500 mb-4" />
                <h3 className="text-xl font-semibold mb-3">
                  Fast &amp; Simple
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  No signup, no clutter. Search, click, and start watching in
                  seconds on any modern browser.
                </p>
              </article>

              <article className="bg-zinc-900 rounded-lg p-6 border border-zinc-800 hover:border-zinc-700 transition">
                <Shield className="w-10 h-10 text-red-500 mb-4" />
                <h3 className="text-xl font-semibold mb-3">
                  We Don&apos;t Host Files
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  CineGhar is an index — we embed content from third-party
                  providers. We never upload, store, or distribute files.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* ==== HOW IT WORKS ==== */}
        <section
          aria-labelledby="how-heading"
          className="py-20 px-4 md:px-6 bg-zinc-900"
        >
          <div className="max-w-4xl mx-auto text-center">
            <h2 id="how-heading" className="text-3xl md:text-4xl font-bold mb-6">
              How It Works
            </h2>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-10">
              CineGhar is a discovery layer for Nepali cinema. You browse our
              curated index, and playback is handled by third-party embedding
              services. No files are stored on our servers.
            </p>

            <ol className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <li className="bg-black rounded-lg p-6 border border-zinc-800">
                <span className="text-red-500 text-3xl font-bold">01</span>
                <h3 className="text-lg font-semibold mt-3 mb-2">Browse</h3>
                <p className="text-gray-400 text-sm">
                  Explore Nepali movies by genre, year, or popularity.
                </p>
              </li>
              <li className="bg-black rounded-lg p-6 border border-zinc-800">
                <span className="text-red-500 text-3xl font-bold">02</span>
                <h3 className="text-lg font-semibold mt-3 mb-2">Choose</h3>
                <p className="text-gray-400 text-sm">
                  Pick a title and select your preferred streaming server.
                </p>
              </li>
              <li className="bg-black rounded-lg p-6 border border-zinc-800">
                <span className="text-red-500 text-3xl font-bold">03</span>
                <h3 className="text-lg font-semibold mt-3 mb-2">Watch</h3>
                <p className="text-gray-400 text-sm">
                  Playback runs through third-party embeds — no downloads, no
                  storage.
                </p>
              </li>
            </ol>
          </div>
        </section>

        {/* ==== CTA ==== */}
        <section
          aria-labelledby="cta-heading"
          className="py-20 px-4 md:px-6 bg-black border-t border-zinc-800"
        >
          <div className="max-w-4xl mx-auto text-center">
            <h2 id="cta-heading" className="text-3xl md:text-4xl font-bold mb-6">
              Start Watching Nepali Movies
            </h2>
            <p className="text-lg md:text-xl text-gray-300 mb-10">
              Dive into the best of Nepali cinema — free, fast, and simple.
            </p>
            <LandingGetStarted />
          </div>
        </section>

        {/* ==== DISCLAIMER ==== */}
        <section
          aria-labelledby="disclaimer-heading"
          className="py-12 px-4 md:px-6 bg-zinc-950 border-t border-zinc-800"
        >
          <div className="max-w-4xl mx-auto">
            <h2
              id="disclaimer-heading"
              className="text-lg font-semibold text-gray-200 mb-4"
            >
              Disclaimer
            </h2>
            <div className="space-y-3 text-sm text-gray-400 leading-relaxed">
              <p>
                <strong className="text-gray-300">
                  CineGhar does not host, upload, store, or distribute any
                  video files on its servers.
                </strong>{" "}
                We are an index and discovery platform. All media content is
                embedded from publicly available third-party providers that
                are not affiliated with CineGhar.
              </p>
              <p>
                We do not take responsibility for the content hosted on
                third-party sites. All trademarks, logos, and copyrights are
                the property of their respective owners.
              </p>
              <p>
                If you are a rights holder and believe content accessible
                through CineGhar infringes your copyright, please review our{" "}
                <Link
                  href="/dmca"
                  className="text-red-500 hover:underline"
                >
                  DMCA policy
                </Link>{" "}
                and contact us. We respond promptly to valid takedown requests.
              </p>
            </div>
          </div>
        </section>

        {/* ==== FOOTER ==== */}
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
                <Link
                  href="/contact"
                  className="hover:underline text-gray-300"
                >
                  Contact us
                </Link>
              </p>
            </div>

            <nav
              aria-label="Footer"
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
            >
              <div>
                <ul className="space-y-3">
                  <li>
                    <Link href="/faq" className="hover:underline text-gray-300">
                      FAQ
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/dmca"
                      className="hover:underline text-gray-300"
                    >
                      DMCA
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/privacy"
                      className="hover:underline text-gray-300"
                    >
                      Privacy
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/terms"
                      className="hover:underline text-gray-300"
                    >
                      Terms of Use
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <ul className="space-y-3">
                  <li>
                    <Link
                      href="/disclaimer"
                      className="hover:underline text-gray-300"
                    >
                      Disclaimer
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/help-center"
                      className="hover:underline text-gray-300"
                    >
                      Help Center
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact"
                      className="hover:underline text-gray-300"
                    >
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/about"
                      className="hover:underline text-gray-300"
                    >
                      About
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <ul className="space-y-3">
                  <li>
                    <Link
                      href="/movies"
                      className="hover:underline text-gray-300"
                    >
                      Movies
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/categories"
                      className="hover:underline text-gray-300"
                    >
                      Categories
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/my-list"
                      className="hover:underline text-gray-300"
                    >
                      My List
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <ul className="space-y-3">
                  <li>
                    <Link
                      href="/account"
                      className="hover:underline text-gray-300"
                    >
                      Account
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/login"
                      className="hover:underline text-gray-300"
                    >
                      Sign In
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/signup"
                      className="hover:underline text-gray-300"
                    >
                      Sign Up
                    </Link>
                  </li>
                </ul>
              </div>
            </nav>

            <div className="mt-10 text-sm text-gray-500">
              <p>© 2025 CineGhar Nepal. All rights reserved.</p>
              <p className="mt-2 text-xs">
                CineGhar does not host any files. All content is provided by
                non-affiliated third parties.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}