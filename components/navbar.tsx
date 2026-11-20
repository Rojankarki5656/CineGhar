"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
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
  SheetClose,
} from "@/components/ui/sheet";
import { Menu, Search, X, Loader2, Star } from "lucide-react";
import { supabase } from "@/utils/supabase/client";

export function Navbar() {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const router = useRouter();
  const pathname = usePathname(); 
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchWrapRef = useRef<HTMLDivElement>(null);

  /* ---------- Auth state (Supabase + Legacy LocalStorage) ---------- */
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(!!localStorage.getItem("userId"));
      }
    };
    checkAuth();

    // Listen for auth changes across tabs
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(!!localStorage.getItem("userId"));
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
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
  }, [showSearch]);

  const clearSearch = () => {
    setShowSearch(false);
    setSearchQuery("");
  };

  /* ---------- Handle Enter Key in Search ---------- */
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim().length > 0) {
      e.preventDefault();
      router.push(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
      clearSearch();
    }
  };

  /* ---------- Logout Logic ---------- */
  const handleLogout = async () => {
    setError("");
    try {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) throw signOutError;
      
      localStorage.removeItem("userId");
      setIsLoggedIn(false);
      router.push("/");
      router.refresh();
    } catch (err) {
      setError("Failed to log out. Please try again.");
    }
  };

  const showDropdown =
    searchQuery.trim().length >= 2 && (searching || results?.length > 0 || searchError);

  // Helper function to check if a link is active
  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-b from-zinc-950 to-zinc-950/80 backdrop-blur-md border-b border-zinc-800/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          
          {/* ---------- Mobile Menu ---------- */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-zinc-800">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-zinc-950 border-r-zinc-800 w-[300px]">
              <SheetHeader className="text-left mb-6">
                <SheetTitle className="text-red-600 text-2xl font-bold">
                  CineGhar
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-2 mt-4">
                <SheetClose asChild>
                  <Link href="/home" className={`text-lg font-medium px-4 py-2 rounded-md transition-colors ${isActive('/') ? 'bg-red-600/10 text-red-500' : 'hover:bg-zinc-800 text-zinc-300'}`}>
                    Home
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/categories" className={`text-lg font-medium px-4 py-2 rounded-md transition-colors ${isActive('/categories') ? 'bg-red-600/10 text-red-500' : 'hover:bg-zinc-800 text-zinc-300'}`}>
                    Categories
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href="/my-list" className={`text-lg font-medium px-4 py-2 rounded-md transition-colors ${isActive('/my-list') ? 'bg-red-600/10 text-red-500' : 'hover:bg-zinc-800 text-zinc-300'}`}>
                    My List
                  </Link>
                </SheetClose>
                {!isLoggedIn && (
                  <SheetClose asChild>
                    <Link href="/login" className="text-lg font-medium px-4 py-2 mt-4 rounded-md bg-red-600 text-white text-center hover:bg-red-700 transition-colors">
                      Sign In
                    </Link>
                  </SheetClose>
                )}
              </nav>
            </SheetContent>
          </Sheet>

          {/* ---------- Logo ---------- */}
          <Link href="/home" className="text-2xl font-bold text-red-600 shrink-0 tracking-tight hover:text-red-500 transition-colors">
            CineGhar
          </Link>

          {/* ---------- Desktop Nav ---------- */}
          <nav className="hidden md:flex items-center space-x-2">
            <Link
              href="/home"
              className={`text-sm font-medium px-3 py-2 rounded-md transition-colors ${isActive('/') ? 'text-white bg-zinc-800/50' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/30'}`}
            >
              Home
            </Link>
            <Link
              href="/categories"
              className={`text-sm font-medium px-3 py-2 rounded-md transition-colors ${isActive('/categories') ? 'text-white bg-zinc-800/50' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/30'}`}
            >
              Categories
            </Link>
            <Link
              href="/my-list"
              className={`text-sm font-medium px-3 py-2 rounded-md transition-colors ${isActive('/my-list') ? 'text-white bg-zinc-800/50' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/30'}`}
            >
              My List
            </Link>
          </nav>

          {/* ---------- Right: search + auth ---------- */}
          <div className="flex items-center space-x-2 md:space-x-4 min-w-0">
            
            {/* Error popup */}
            {error && (
              <div className="absolute top-full right-4 mt-2 bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-2 rounded-md text-sm shadow-lg backdrop-blur-sm animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}

            {/* Search Bar */}
            {showSearch ? (
              <div ref={searchWrapRef} className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <Input
                    ref={searchInputRef}
                    type="search"
                    placeholder="Search movies, TV…"
                    spellCheck={false}
                    className="w-[200px] md:w-[260px] lg:w-[320px] bg-zinc-900 border-zinc-700 text-white pl-9 pr-8 focus-visible:ring-1 focus-visible:ring-red-500 focus-visible:border-red-500 transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                    aria-label="Search movies by title"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full text-zinc-400 hover:text-white hover:bg-transparent"
                    onClick={clearSearch}
                    aria-label="Close search"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Search Dropdown */}
                {showDropdown && (
                  <div className="absolute top-full right-0 w-[300px] md:w-[360px] lg:w-[400px] bg-zinc-950 border border-zinc-800 rounded-lg mt-2 shadow-2xl z-50 max-h-[400px] overflow-y-auto overflow-x-hidden">
                    {searching && (
                      <div className="flex items-center justify-center gap-2 p-6 text-zinc-400 text-sm">
                        <Loader2 className="w-5 h-5 animate-spin text-red-500" />
                        Searching…
                      </div>
                    )}

                    {!searching && searchError && (
                      <div className="p-4 text-red-400 text-sm text-center">
                        {searchError}
                      </div>
                    )}

                    {!searching && !searchError && results?.length === 0 && (
                      <div className="p-6 text-zinc-400 text-sm text-center">
                        No results for “<span className="text-white font-medium">{searchQuery}</span>”
                      </div>
                    )}

                    {!searching && !searchError && results?.map((movie) => (
                        <Link
                          key={movie.id}
                          href={`/movies/${movie.imdbId ?? movie.id}`}
                          className="flex items-center gap-4 p-3 hover:bg-zinc-900 transition-colors border-b border-zinc-800/50 last:border-0 group"
                          onClick={clearSearch}
                        >
                          <div className="relative w-12 h-[72px] rounded-md overflow-hidden bg-zinc-800 shrink-0 border border-zinc-800">
                            <Image
                              src={movie.image || "/placeholder.svg"}
                              alt={`${movie.title} poster`}
                              fill
                              sizes="48px"
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => { e.currentTarget.src = "/placeholder.svg"; }}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-sm text-zinc-100 line-clamp-1 group-hover:text-white">
                              {movie.title}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1.5">
                              {movie.year && <span>{movie.year}</span>}
                              {movie.isSeries && (
                                <>
                                  <span className="w-1 h-1 rounded-full bg-zinc-600" />
                                  <span className="border border-zinc-700 px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider">TV</span>
                                </>
                              )}
                              {movie.rating != null && (
                                <>
                                  <span className="w-1 h-1 rounded-full bg-zinc-600" />
                                  <span className="flex items-center text-yellow-500 font-medium">
                                    <Star className="w-3 h-3 mr-1 fill-yellow-500" />
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
                className="text-zinc-300 hover:text-white hover:bg-zinc-800/50 transition-colors"
                aria-label="Open search"
              >
                <Search className="h-5 w-5" />
              </Button>
            )}

            {/* User Auth Profile / Sign In */}
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full ml-1 ring-2 ring-transparent hover:ring-red-500 transition-all">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src="/images/avatar.png" alt="User" />
                      <AvatarFallback className="bg-zinc-800 text-zinc-300">U</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-zinc-950 border-zinc-800 text-zinc-300">
                  <DropdownMenuItem className="focus:bg-zinc-900 focus:text-white cursor-pointer py-2">
                    <Link href="/profile" className="w-full">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-zinc-900 focus:text-white cursor-pointer py-2">
                    <Link href="/settings" className="w-full">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-zinc-800" />
                  <DropdownMenuItem
                    className="focus:bg-red-500/10 focus:text-red-500 text-red-400 cursor-pointer py-2 font-medium"
                    onClick={handleLogout}
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button
                  variant="default"
                  className="bg-red-600 hover:bg-red-700 text-white transition-all duration-300 font-medium px-5 ml-1"
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