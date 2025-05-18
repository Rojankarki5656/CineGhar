import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Info, Play } from "lucide-react"

interface HeroBannerProps {
  title: string
  description: string
  imageUrl: string
  year: string
  duration: string
  rating: string
}

export function HeroBanner({ title, description, imageUrl, year, duration, rating }: HeroBannerProps) {
  return (
    <div className="relative h-[70vh] w-full">
      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent z-10" />

      {/* Background Image */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${imageUrl})` }} />

      {/* Content */}
      <div className="relative z-20 h-full flex flex-col justify-end p-6 md:p-12 max-w-3xl">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3">{title}</h2>

        <div className="flex items-center gap-3 mb-4 text-sm md:text-base text-gray-300">
          <span>{year}</span>
          <span className="w-1 h-1 rounded-full bg-gray-500"></span>
          <span>{duration}</span>
          <span className="w-1 h-1 rounded-full bg-gray-500"></span>
          <span>{rating}</span>
        </div>

        <p className="text-gray-300 mb-6 line-clamp-3 md:line-clamp-4 text-sm md:text-base lg:text-lg">{description}</p>

        <div className="flex flex-wrap gap-4">
          <Link href={`/watch/1`}>
            <Button className="bg-red-600 hover:bg-red-700 text-white gap-2">
              <Play className="w-5 h-5 fill-white" />
              Play
            </Button>
          </Link>
          <Link href={`/movies/2`}>
            <Button variant="outline" className="gap-2">
              <Info className="w-5 h-5" />
              More Info
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
