"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSearch } from "@/hooks/searchService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, Search, X, Loader2, Star } from "lucide-react";

export function Navbar() {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchWrapRef = useRef<HTMLDivElement>(null);

  /* ---------- Auth state ---------- */
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    setIsLoggedIn(!!userId);
  }, []);

  /* ---------- Search hook ---------- */
  const { data: results, loading: searching, error: searchError } = useSearch(
    { query: searchQuery },
    { debounceMs: 300, minLength: 2, limit: 8 },
  );

  /* ---------- Focus input when opened ---------- */
  useEffect(() => {
    if (showSearch) searchInputRef.current?.focus();
  }, [showSearch]);

  /* ---------- Click outside closes search ---------- */
  useEffect(() => {
    if (!showSearch) return;
    const onClick = (e: MouseEvent) => {
      if (
        searchWrapRef.current &&
        !searchWrapRef.current.contains(e.target as Node)
      ) {
        clearSearch();
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [showSearch]);

  /* ---------- ESC closes search ---------- */
  useEffect(() => {
    if (!showSearch) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") clearSearch();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showSearch]);

  const clearSearch = () => {
    setShowSearch(false);
    setSearchQuery("");
  };

  const handleLogout = async () => {
    setError("");
    try {
      if (error) {
        setError("Failed to log out: ");
        return;
      }
      localStorage.removeItem("userId");
      setIsLoggedIn(false);
      router.push("/home");
    } catch {
      setError("An unexpected error occurred during logout");
    }
  };

  const showDropdown =
    searchQuery.trim().length >= 2 && (searching || results.length > 0 || searchError);

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-b from-black to-transparent backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* ---------- Mobile Menu ---------- */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-white"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-zinc-900 border-zinc-800">
              <SheetHeader>
                <SheetTitle className="text-red-600 text-2xl">
                  CineGhar
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-8">
                <Link
                  href="/home"
                  className="text-lg font-medium hover:text-red-600 transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/movies"
                  className="text-lg font-medium hover:text-red-600 transition-colors"
                >
                  Movies
                </Link>
                <Link
                  href="/categories"
                  className="text-lg font-medium hover:text-red-600 transition-colors"
                >
                  Categories
                </Link>
                <Link
                  href="/my-list"
                  className="text-lg font-medium hover:text-red-600 transition-colors"
                >
                  My List
                </Link>
                {!isLoggedIn && (
                  <Link
                    href="/login"
                    className="text-lg font-medium hover:text-red-600 transition-colors"
                  >
                    Sign In
                  </Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>

          {/* ---------- Logo ---------- */}
          <Link
            href="/home"
            className="text-2xl font-bold text-red-600 shrink-0"
          >
            CineGhar
          </Link>

          {/* ---------- Desktop Nav ---------- */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/home"
              className="text-sm font-medium hover:text-red-600 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/categories"
              className="text-sm font-medium hover:text-red-600 transition-colors"
            >
              Categories
            </Link>
            <Link
              href="/my-list"
              className="text-sm font-medium hover:text-red-600 transition-colors"
            >
              My List
            </Link>
          </nav>

          {/* ---------- Right: search + auth ---------- */}
          <div className="flex items-center space-x-3 md:space-x-4 min-w-0">
            {error && (
              <div className="hidden lg:block bg-red-500/20 border border-red-500 text-red-500 p-2 rounded-md text-sm">
                {error}
              </div>
            )}

            {showSearch ? (
              <div ref={searchWrapRef} className="relative">
                <Input
                  ref={searchInputRef}
                  type="search"
                  placeholder="Search movies, TV…"
                  className="w-[220px] md:w-[260px] lg:w-[320px] bg-zinc-800 border-zinc-700 text-white pr-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search movies by title"
                  aria-autocomplete="list"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 text-gray-400 hover:text-white"
                  onClick={clearSearch}
                  aria-label="Close search"
                >
                  <X className="h-4 w-4" />
                </Button>

                {/* ---------- Dropdown ---------- */}
                {showDropdown && (
                  <div className="absolute top-full left-0 w-full md:w-[320px] lg:w-[380px] bg-zinc-900 border border-zinc-700 rounded-md mt-1 shadow-2xl z-50 max-h-96 overflow-y-auto">
                    {searching && (
                      <div className="flex items-center gap-2 p-3 text-gray-400 text-sm">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Searching…
                      </div>
                    )}

                    {!searching && searchError && (
                      <div className="p-3 text-red-400 text-sm">
                        {searchError}
                      </div>
                    )}

                    {!searching && !searchError && results.length === 0 && (
                      <div className="p-3 text-gray-400 text-sm">
                        No results for “{searchQuery}”
                      </div>
                    )}

                    {!searching &&
                      !searchError &&
                      results.map((movie) => (
                        <Link
                          key={movie.id}
                          href={`/movies/${movie.imdbId ?? movie.id}`}
                          className="flex items-center gap-3 p-3 hover:bg-zinc-800 transition-colors border-b border-zinc-800/50 last:border-0"
                          onClick={clearSearch}
                        >
                          <div className="relative w-12 h-16 rounded overflow-hidden bg-zinc-800 shrink-0">
                            <Image
                              src={movie.image || "/placeholder.svg"}
                              alt={`${movie.title} poster`}
                              fill
                              sizes="48px"
                              className="object-cover"
                              onError={(e) => {
                                e.currentTarget.src = "/placeholder.svg";
                              }}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-sm line-clamp-1">
                              {movie.title}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                              {movie.year && <span>{movie.year}</span>}
                              {movie.isSeries && (
                                <>
                                  <span>•</span>
                                  <span>TV</span>
                                </>
                              )}
                              {movie.rating != null && (
                                <>
                                  <span>•</span>
                                  <span className="flex items-center">
                                    <Star className="w-3 h-3 mr-0.5 text-yellow-500 fill-yellow-500" />
                                    {movie.rating}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </Link>
                      ))}
                  </div>
                )}
              </div>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSearch(true)}
                aria-label="Open search"
              >
                <Search className="h-5 w-5" />
              </Button>
            )}

            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/images/avatar.png" alt="User" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-zinc-900 border-zinc-800"
                >
                  <DropdownMenuItem className="focus:bg-zinc-800 focus:text-white">
                    <Link href="/profile" className="w-full">
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-zinc-800 focus:text-white">
                    <Link href="/settings" className="w-full">
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-zinc-800" />
                  <DropdownMenuItem
                    className="focus:bg-zinc-800 focus:text-white cursor-pointer"
                    onClick={handleLogout}
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button
                  variant="ghost"
                  className="text-white hover:text-white hover:bg-red-600/30 transition-all duration-300 text-base"
                >
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}