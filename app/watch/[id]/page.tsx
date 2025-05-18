"use client";

import { use, useState, useCallback, useRef } from "react";
import Link from "next/link";
import ReactPlayer from "react-player";
import { ArrowLeft, Maximize, Minimize, Pause, Play, Settings, Volume2, VolumeX } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { movies } from "@/lib/movies";

export default function WatchPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const movieId = resolvedParams.id;

  const movie = movies.find((m) => m.id === movieId);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const playerRef = useRef<ReactPlayer>(null);

  if (!movie) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Movie not found</div>;

  const togglePlay = useCallback(() => setIsPlaying((prev) => !prev), []);
  const toggleMute = useCallback(() => setIsMuted((prev) => !prev), []);
  const toggleFullscreen = useCallback(() => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen((prev) => !prev);
  }, [isFullscreen]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h ? `${h}:` : ""}${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="relative h-screen w-full flex flex-col">
        <ReactPlayer
          ref={playerRef}
          url={movie.videoUrl}
          playing={isPlaying}
          muted={isMuted}
          width="100%"
          height="100%"
          config={{
            youtube: {
              playerVars: { controls: 0, modestbranding: 1, rel: 0 },
            },
          }}
          onProgress={({ played, playedSeconds }) => {
            setProgress(played * 100);
            setCurrentTime(playedSeconds);
          }}
          onDuration={setDuration}
          onError={() => console.error("Failed to load YouTube video")}
        />

        <div className="absolute top-0 left-0 w-full p-4 z-10 bg-gradient-to-b from-black/80 to-transparent">
          <div className="flex items-center gap-4">
            <Link href={`/movies/${movie.id}`}>
              <Button variant="ghost" size="icon" className="text-white" aria-label="Go back">
                <ArrowLeft className="w-6 h-6" />
              </Button>
            </Link>
            <h1 className="text-xl font-medium">{movie.title}</h1>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-4 z-10 bg-gradient-to-t from-black/80 to-transparent">
          <div className="space-y-4">
            <Slider
              value={[progress]}
              max={100}
              step={1}
              onValueChange={(value) => {
                const seekTo = (value[0] / 100) * duration;
                playerRef.current?.seekTo(seekTo, "seconds");
                setProgress(value[0]);
              }}
              className="w-full [&>span:first-child]:h-1.5 [&>span:first-child]:bg-white/30 [&_[role=slider]]:bg-red-600 [&_[role=slider]]:w-4 [&_[role=slider]]:h-4 [&_[role=slider]]:border-0 [&>span:first-child_span]:bg-red-600 [&_[role=slider]:focus-visible]:ring-0 [&_[role=slider]:focus-visible]:ring-offset-0"
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white"
                  onClick={togglePlay}
                  aria-label={isPlaying ? "Pause video" : "Play video"}
                >
                  {isPlaying ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white" />}
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white"
                  onClick={toggleMute}
                  aria-label={isMuted ? "Unmute video" : "Mute video"}
                >
                  {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                </Button>

                <span className="text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-white" aria-label="Settings">
                      <Settings className="w-6 h-6" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800">
                    <DropdownMenuLabel>Quality</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-zinc-800" />
                    <DropdownMenuItem className="focus:bg-zinc-800 focus:text-white">Auto</DropdownMenuItem>
                    <DropdownMenuItem className="focus:bg-zinc-800 focus:text-white">1080p</DropdownMenuItem>
                    <DropdownMenuItem className="focus:bg-zinc-800 focus:text-white">720p</DropdownMenuItem>
                    <DropdownMenuItem className="focus:bg-zinc-800 focus:text-white">480p</DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-zinc-800" />
                    <DropdownMenuLabel>Subtitles</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-zinc-800" />
                    <DropdownMenuItem className="focus:bg-zinc-800 focus:text-white">English</DropdownMenuItem>
                    <DropdownMenuItem className="focus:bg-zinc-800 focus:text-white">Nepali</DropdownMenuItem>
                    <DropdownMenuItem className="focus:bg-zinc-800 focus:text-white">Off</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white"
                  onClick={toggleFullscreen}
                  aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                >
                  {isFullscreen ? <Minimize className="w-6 h-6" /> : <Maximize className="w-6 h-6" />}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}