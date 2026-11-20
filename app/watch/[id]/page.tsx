// app/watch/[id]/page.tsx
import type { Metadata } from "next";
import WatchClient from "./watch-client";
import { fetchTitleDetails } from "@/lib/title-service";

interface WatchPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: WatchPageProps): Promise<Metadata> {
  const { id } = await params;
  const title = await fetchTitleDetails(id);

  if (!title) {
    return {
      title: "Watch Online | CineGhar",
      description: "Stream movies and TV shows in HD on CineGhar.",
      alternates: { canonical: `/watch/${id}` },
      robots: { index: false, follow: true },
    };
  }

  const yearSuffix = title.year ? ` (${title.year})` : "";
  const displayTitle = `${title.title}${yearSuffix}`;
  const description =
    title.plot?.slice(0, 160) ||
    `Stream ${title.title}${yearSuffix} in HD on CineGhar. Multiple servers available.`;

  const openGraphType: "video.tv_show" | "video.movie" = title.isSeries
    ? "video.tv_show"
    : "video.movie";

  // title.image is guaranteed to be a string here (or undefined)
  const image = title.image;

  return {
    title: `Watch ${displayTitle} Online | CineGhar`,
    description,
    alternates: { canonical: `/watch/${id}` },
    robots: { index: false, follow: true },
    openGraph: {
      title: `Watch ${displayTitle} | CineGhar`,
      description,
      type: openGraphType,
      url: `/watch/${id}`,
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: `Watch ${displayTitle} | CineGhar`,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

export default function WatchPage({ params }: WatchPageProps) {
  return <WatchClient params={params} />;
}