"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Search, X } from "lucide-react";
import { movies } from "@/lib/movies";

export function Navbar() {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<
    { id: string; title: string; imageUrl: string; year: string; rating: string }[]
  >([]);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    setIsLoggedIn(!!userId);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }
    const results = movies
      .filter((movie) => movie.title.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 5)
      .map(({ id, title, imageUrl, year, rating }) => ({
        id,
        title,
        imageUrl,
        year,
        rating,
      }));
    setSearchResults(results);
  };

  const clearSearch = () => {
    setShowSearch(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleLogout = async () => {
    setError("");
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        setError("Failed to log out: " + error.message);
        return;
      }
      localStorage.removeItem("userId");
      setIsLoggedIn(false);
      router.push("/");
    } catch (err) {
      setError("An unexpected error occurred during logout");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-b from-black to-transparent">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-white">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-zinc-900 border-zinc-800">
              <SheetHeader>
                <SheetTitle className="text-red-600 text-2xl">CineGhar</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="/home" className="text-lg font-medium hover:text-red-600 transition-colors">
                  Home
                </Link>
                <Link href="/movies" className="text-lg font-medium hover:text-red-600 transition-colors">
                  Movies
                </Link>
                <Link href="/categories" className="text-lg font-medium hover:text-red-600 transition-colors">
                  Categories
                </Link>
                <Link href="/my-list" className="text-lg font-medium hover:text-red-600 transition-colors">
                  My List
                </Link>
                {!isLoggedIn && (
                  <Link href="/login" className="text-lg font-medium hover:text-red-600 transition-colors">
                    Sign In
                  </Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/home" className="text-2xl font-bold text-red-600">
            CineGhar
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/home" className="text-sm font-medium hover:text-red-600 transition-colors">
              Home
            </Link>
            <Link href="/categories" className="text-sm font-medium hover:text-red-600 transition-colors">
              Categories
            </Link>
            <Link href="/my-list" className="text-sm font-medium hover:text-red-600 transition-colors">
              My List
            </Link>
          </nav>

          {/* Right Side - Search & Profile/Sign In */}
          <div className="flex items-center space-x-4">
            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-500 p-2 rounded-md text-sm">
                {error}
              </div>
            )}

            {showSearch ? (
              <div className="relative">
                <Input
                  type="search"
                  placeholder="Search movies..."
                  className="w-full md:w-[200px] lg:w-[300px] bg-zinc-800 border-zinc-700 text-white pr-8"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  autoFocus
                  aria-label="Search movies by title"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 text-gray-400"
                  onClick={clearSearch}
                  aria-label="Close search"
                >
                  <X className="h-4 w-4" />
                </Button>
                {searchResults.length > 0 && (
                  <div className="absolute top-full left-0 w-full bg-zinc-900 border border-zinc-700 rounded-md mt-1 shadow-lg z-50 max-h-96 overflow-y-auto">
                    {searchResults.map((movie) => (
                      <Link
                        key={movie.id}
                        href={`/movies/${movie.id}`}
                        className="flex items-center gap-3 p-3 hover:bg-zinc-800 transition-colors"
                        onClick={clearSearch}
                      >
                        <img
                          src={movie.imageUrl || "/placeholder.svg"}
                          alt={`${movie.title} poster`}
                          className="w-12 h-18 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium">{movie.title}</p>
                          <p className="text-sm text-gray-400">{movie.year} • {movie.rating}/5</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
                {searchQuery && searchResults.length === 0 && (
                  <div className="absolute top-full left-0 w-full bg-zinc-900 border border-zinc-700 rounded-md mt-1 shadow-lg z-50 p-3 text-gray-400">
                    No movies found
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
                <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800">
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