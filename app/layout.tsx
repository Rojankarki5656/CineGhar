import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { GoogleAnalytics } from "@next/third-parties/google";

const inter = Inter({ subsets: ["latin"] });

// Base site URL
const baseUrl = "https://cine-ghar.vercel.app"; // 🔁 Update with your actual domain

export const metadata: Metadata = {
  title: {
    default: "Cine Ghar – Watch Nepali & Indian Movies Online",
    template: "%s | Cine Ghar",
  },
  description:
    "Stream Nepali and Indian movies online in HD. Watch latest films, dramas, and web series on Cine Ghar – your ultimate movie hub.",
  keywords: [
    "Nepali movies",
    "Indian movies",
    "Cine Ghar",
    "Watch movies online",
    "Free Nepali films",
    "HD movies",
    "Movie streaming Nepal",
    "Online cinema",
    "Nepali cinema",
    "Indian cinema",
    "Latest Nepali movies",
    "Latest Indian movies",
    "Nepali web series",
    "Indian web series",
    "Nepali dramas",
    "Indian dramas",
    "Watch Nepali movies",
    "Watch Indian movies",
    "Cine Ghar movies",
    "Cine Ghar streaming",
    "Cine Ghar Nepali movies",
    "Cine Ghar Indian movies",
    "Cine Ghar watch online",
    "Cine Ghar free movies",
    "Cine Ghar HD streaming",
    "Cine Ghar cinema",
    "Cine Ghar online cinema",
    "Cine Ghar latest movies",
    "Cine Ghar web series",
    "Cine Ghar dramas",
    "Cine Ghar watch free",
    "Cine Ghar watch HD",
    "Cinema Ghar",
    "Cine Ghar watch online free",
    "Cine Ghar watch HD movies",
    "Cine Ghar free streaming",
    "Cine Ghar online movies",
    "Cine Ghar movie hub",
    "Cine Ghar movie streaming",
    "Cine Ghar movie collection",
    "Cine Ghar movie library",
    "Cine Ghar movie platform",
    "Cine Ghar movie experience",
    "Cine Ghar movie portal",
    "Cine Ghar movie site",
    "Cine Ghar movie watch",
    "Cine Ghar movie online",
    "Cine Ghar movie streaming site",
    "Cine Ghar movie streaming platform",
    "Cine Ghar movie streaming online",
    "Cine Ghar movie streaming free",
    "Cine Ghar movie streaming HD",
    "Cine Ghar movie streaming Nepal",
    "Cine Ghar movie streaming India",
    "Nepali movies online",
    "Nepali movies download",
    "Nepali movies free",
    "Watch Nepali movies online",
    "Watch Nepali movies free",
    "Watch Nepali movies HD",
    "Watch Nepali movies for free",
  ],
  authors: [{ name: "Cine Ghar Team", url: baseUrl }],
  robots: "index, follow",
  metadataBase: new URL(baseUrl),
  applicationName: "Cine Ghar",
  generator: "Next.js",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_NP",
    url: baseUrl,
    siteName: "FilmySansar",
    title: "FilmySansar – Watch Nepali & Indian Movies Online",
    description:
      "Stream Nepali and Indian movies online in HD. Watch latest films, dramas, and web series on FilmySansar.",
    images: [
      {
        url: `${baseUrl}/favicon.jpg`, // ✅ Use your real OG image
        width: 1200,
        height: 630,
        alt: "Cine Ghar – Watch Nepali & Indian Movies Online",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cine Ghar – Watch Nepali & Indian Movies Online",
    description: "Stream Nepali and Indian movies in HD.",
    site: "@cineghar", // 🛠️ Your Twitter handle
    creator: "@cineghar",
    images: [`${baseUrl}/favicon.jpg`],
  },
  alternates: {
    canonical: baseUrl,
  },
  other: {
    rating: "general",
    "revisit-after": "7 days",
    distribution: "global",
  },
};

export const viewport: Viewport = {
  themeColor: "#DC2626",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        {/* ✅ Optional: JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Cine Ghar",
              url: baseUrl,
              logo: `${baseUrl}/favicon.png`,
              sameAs: [
                "https://www.facebook.com/cineghar",
                "https://www.instagram.com/cineghar",
              ],
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
      <GoogleAnalytics gaId="G-DBX80G890F" />
    </html>
  );
}
