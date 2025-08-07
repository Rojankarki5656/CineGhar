"use client";

import { use, useState, useCallback, useRef, useEffect, Suspense } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import type ReactPlayerType from "react-player";
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

// Dynamically import ReactPlayer, disabling SSR
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

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
  const [error, setError] = useState<string | null>(null);
  const [showControls, setShowControls] = useState(true); // Control visibility
  const playerRef = useRef<ReactPlayerType>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const togglePlay = useCallback(() => setIsPlaying((prev) => !prev), []);
  const toggleMute = useCallback(() => setIsMuted((prev) => !prev), []);
  const toggleFullscreen = useCallback(() => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen().catch((err) => console.error("Fullscreen error:", err));
    } else {
      document.exitFullscreen().catch((err) => console.error("Exit fullscreen error:", err));
    }
    setIsFullscreen((prev) => !prev);
  }, [isFullscreen]);

  // Auto-hide controls after 4 seconds of inactivity
  const resetControlsTimeout = useCallback(() => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    setShowControls(true);
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 4000);
  }, []);

  // Handle user interactions to show controls
  useEffect(() => {
    const handleInteraction = () => resetControlsTimeout();

    window.addEventListener("mousemove", handleInteraction);
    window.addEventListener("click", handleInteraction);
    window.addEventListener("keydown", handleInteraction);

    resetControlsTimeout(); // Initial timeout

    return () => {
      window.removeEventListener("mousemove", handleInteraction);
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [resetControlsTimeout]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h ? `${h}:` : ""}${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Early returns after all hooks
  if (!movie) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Movie not found</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
        <p>{error}</p>
        <Button onClick={() => setError(null)}>Retry</Button>
      </div>
    );
  }

  const isYouTube = movie.videoUrl.includes("youtube.com") || movie.videoUrl.includes("youtu.be");
  const isArchive = movie.videoUrl.includes("archive.org");

  // Use iframe for archive.org
  if (isArchive) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="relative h-screen w-full flex flex-col">
          <iframe
            src={movie.videoUrl}
            width="100%"
            height="100%"
            frameBorder="0"
            allow="autoplay; fullscreen"
            allowFullScreen
            onMouseMove={resetControlsTimeout}
            onClick={resetControlsTimeout}
          />
          <div
            className={`absolute top-0 left-0 w-full p-4 z-10 bg-gradient-to-b from-black/80 to-transparent transition-opacity duration-300 ${
              showControls ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="flex items-center gap-4">
              <Link href={`/movies/${movie.id}`}>
                <Button variant="ghost" size="icon" className="text-white" aria-label="Go back">
                  <ArrowLeft className="w-6 h-6" />
                </Button>
              </Link>
              <h1 className="text-xl font-medium">{movie.title}</h1>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="relative h-screen w-full flex flex-col">
        <Suspense fallback={<div className="text-white text-center">Loading video...</div>}>
          <ReactPlayer
            ref={playerRef}
            url={movie.videoUrl}
            playing={isPlaying}
            muted={isMuted}
            width="100%"
            height="100%"
            config={
              isYouTube
                ? {
                    youtube: {
                      playerVars: { 
                          controls: 0,          // Hide default controls
                          modestbranding: 1,    // Minimal YouTube branding
                          rel: 0,               // No related videos at the end
                          fs: 1,                // Fullscreen button
                          disablekb: 1,         // Disable keyboard shortcuts
                          iv_load_policy: 3,    // Hide annotations
                          cc_load_policy: 0,    // Don’t show captions by default
                      },
                    },
                  }
                : {}
            }
            onProgress={({ played, playedSeconds }) => {
              setProgress(played * 100);
              setCurrentTime(playedSeconds);
            }}
            onDuration={setDuration}
            onError={(error) => {
              console.error("Video playback error:", error);
              setError(
                isYouTube
                  ? "Failed to load YouTube video. Please check the URL or try again."
                  : "Failed to load video. The source may not be supported or the URL is invalid."
              );
            }}
            onReady={() => console.log("Player ready:", movie.videoUrl)}
            onMouseMove={resetControlsTimeout}
            onClick={resetControlsTimeout}
          />
        </Suspense>

        {/* Dedicated Pause Button for YouTube */}
        {isYouTube && isPlaying && (
          <div
            className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 transition-opacity duration-300 ${
              showControls ? "opacity-100" : "opacity-0"
            }`}
          >
            <Button
              variant="ghost"
              size="icon"
              className="bg-black/50 text-white hover:bg-black/70 w-16 h-16 rounded-full"
              onClick={() => {
                setIsPlaying(false);
                resetControlsTimeout();
              }}
              aria-label="Pause video"
            >
              <Pause className="w-8 h-8 fill-white" />
            </Button>
          </div>
        )}

        <div
          className={`absolute top-0 left-0 w-full p-4 z-10 bg-gradient-to-b from-black/80 to-transparent transition-opacity duration-300 ${
            showControls ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex items-center gap-4">
            <Link href={`/movies/${movie.id}`}>
              <Button variant="ghost" size="icon" className="text-white" aria-label="Go back">
                <ArrowLeft className="w-6 h-6" />
              </Button>
            </Link>
            <h1 className="text-xl font-medium">{movie.title}</h1>
          </div>
        </div>

        <div
          className={`absolute bottom-0 left-0 w-full p-4 z-10 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 ${
            showControls ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="space-y-4">
            <Slider
              value={[progress]}
              max={100}
              step={1}
              onValueChange={(value) => {
                const seekTo = (value[0] / 100) * duration;
                playerRef.current?.seekTo(seekTo, "seconds");
                setProgress(value[0]);
                resetControlsTimeout();
              }}
              className="w-full [&>span:first-child]:h-1.5 [&>span:first-child]:bg-white/30 [&_[role=slider]]:bg-red-600 [&_[role=slider]]:w-4 [&_[role=slider]]:h-4 [&_[role=slider]]:border-0 [&>span:first-child_span]:bg-red-600 [&_[role=slider]:focus-visible]:ring-0 [&_[role=slider]:focus-visible]:ring-offset-0"
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white"
                  onClick={() => {
                    togglePlay();
                    resetControlsTimeout();
                  }}
                  aria-label={isPlaying ? "Pause video" : "Play video"}
                >
                  {isPlaying ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white" />}
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white"
                  onClick={() => {
                    toggleMute();
                    resetControlsTimeout();
                  }}
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
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white"
                      aria-label="Settings"
                      onClick={resetControlsTimeout}
                    >
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
                  onClick={() => {
                    toggleFullscreen();
                    resetControlsTimeout();
                  }}
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