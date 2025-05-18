"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trash2, Film, LogOut } from "lucide-react";
import { movies } from "@/lib/movies";

type MovieSummary = {
  id: string | number;
  title: string;
  imageUrl: string;
  year: number;
  rating: number;
};

export default function ProfilePage() {
  const [userData, setUserData] = useState({
    name: "User",
    email: "user@example.com",
    avatar: "/images/avatar.png",
  });
  const [viewingHistory, setViewingHistory] = useState<MovieSummary[]>([]);
  const [watchlist, setWatchlist] = useState<MovieSummary[]>([]);
  const [recommendations, setRecommendations] = useState<MovieSummary[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setError("No user ID found. Please log in.");
        router.push("/login");
        return;
      }

      try {
        const { data, error } = await supabase
          .from("users")
          .select("full_name, email")
          .eq("id", userId)
          .single();

        if (error) {
          setError("Failed to fetch user data: " + error.message);
          return;
        }

        if (data) {
          setUserData({
            name: data.full_name,
            email: data.email,
            avatar: userData.avatar, // Maintain default avatar or update if stored elsewhere
          });
        }
      } catch (err) {
        setError("An unexpected error occurred while fetching user data");
      }
    };

    fetchUserData();

    // Load viewing history
    const historyIds = JSON.parse(localStorage.getItem("viewingHistory") || "[]");
    const history = movies
      .filter((m) => historyIds.includes(m.id))
      .map(({ id, title, imageUrl, year, rating }) => ({
        id,
        title,
        imageUrl,
        year: Number(year),
        rating: Number(rating),
      }));
    setViewingHistory(history);

    // Load watchlist
    const watchlistIds = JSON.parse(localStorage.getItem("myList") || "[]");
    const watchlistMovies = movies
      .filter((m) => watchlistIds.includes(m.id))
      .map(({ id, title, imageUrl, year, rating }) => ({
        id,
        title,
        imageUrl,
        year: Number(year),
        rating: Number(rating),
      }));
    setWatchlist(watchlistMovies);

    // Generate recommendations based on viewed genres
    const viewedGenres = movies
      .filter((m) => historyIds.includes(m.id))
      .flatMap((m) => m.genres || []);
    const uniqueGenres = [...new Set(viewedGenres)];
    const recs = movies
      .filter((m) => !historyIds.includes(m.id) && m.genres?.some((g) => uniqueGenres.includes(g)))
      .slice(0, 5)
      .map(({ id, title, imageUrl, year, rating }) => ({
        id,
        title,
        imageUrl,
        year: Number(year),
        rating: Number(rating),
      }));
    setRecommendations(recs);
  }, [router]);

  const handleSave = async () => {
    const updatedUser = { ...userData };
    const userId = localStorage.getItem("userId");

    if (!userId) {
      setError("No user ID found. Please log in.");
      return;
    }

    try {
      if (avatarFile) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          if (e.target && typeof e.target.result === "string") {
            updatedUser.avatar = e.target.result;
            setUserData(updatedUser);
            setAvatarFile(null);
          }
        };
        reader.readAsDataURL(avatarFile);
      }

      // Update user data in Supabase
      const { error } = await supabase
        .from("users")
        .update({ full_name: updatedUser.name, email: updatedUser.email })
        .eq("id", userId);

      if (error) {
        setError("Failed to update user data: " + error.message);
        return;
      }

      setUserData(updatedUser);
      setIsEditing(false);
    } catch (err) {
      setError("An unexpected error occurred while updating user data");
    }
  };

  const clearHistory = () => {
    localStorage.setItem("viewingHistory", "[]");
    setViewingHistory([]);
    setRecommendations([]);
  };

  const removeFromWatchlist = (id: string | number) => {
    const updatedWatchlist = watchlist.filter((m) => m.id !== id);
    localStorage.setItem("myList", JSON.stringify(updatedWatchlist.map((m) => m.id)));
    setWatchlist(updatedWatchlist);
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        setError("Failed to log out: " + error.message);
        return;
      }
      localStorage.removeItem("userId");
      localStorage.removeItem("myList");
      localStorage.removeItem("viewingHistory");
      router.push("/");
    } catch (err) {
      setError("An unexpected error occurred during logout");
    }
  };

  const deleteAccount = async () => {
    if (confirm("Are you sure you want to delete your account? This cannot be undone.")) {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setError("No user ID found. Please log in.");
        return;
      }

      try {
        // Note: Supabase does not provide a direct API to delete auth.users.
        // You may need to implement a server-side function to handle this securely.
        // For now, we'll clear local data and log out.
        await supabase.auth.signOut();
        localStorage.clear();
        router.push("/");
      } catch (err) {
        setError("An unexpected error occurred while deleting account");
      }
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      <main className="px-4 md:px-6 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <h1 className="text-3xl font-bold">Profile</h1>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-500 p-3 rounded-md">
              {error}
            </div>
          )}

          {/* User Information */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle>User Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={userData.name}
                      onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                      className="bg-zinc-800 border-zinc-700"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userData.email}
                      onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                      className="bg-zinc-800 border-zinc-700"
                    />
                  </div>
                  <div>
                    <Label htmlFor="avatar">Avatar</Label>
                    <Input
                      id="avatar"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                      className="bg-zinc-800 border-zinc-700"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSave} className="bg-red-600 hover:bg-red-700">
                      Save
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={userData.avatar} alt="User avatar" />
                    <AvatarFallback>{userData.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-lg font-medium">{userData.name}</p>
                    <p className="text-gray-400">{userData.email}</p>
                    <Button
                      variant="outline"
                      className="mt-2"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Profile
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Viewing History */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Viewing History</CardTitle>
              {viewingHistory.length > 0 && (
                <Button variant="destructive" onClick={clearHistory}>
                  Clear History
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {viewingHistory.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {viewingHistory.map((movie) => (
                    <Link
                      key={movie.id}
                      href={`/movies/${movie.id}`}
                      className="flex flex-col items-center"
                    >
                      <img
                        src={movie.imageUrl}
                        alt={`${movie.title} poster`}
                        className="w-full aspect-[2/3] object-cover rounded"
                      />
                      <p className="text-sm mt-2 text-center">{movie.title}</p>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No viewing history yet.</p>
              )}
            </CardContent>
          </Card>

          {/* Watchlist */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle>My List</CardTitle>
            </CardHeader>
            <CardContent>
              {watchlist.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {watchlist.map((movie) => (
                    <div key={movie.id} className="flex flex-col items-center">
                      <Link href={`/movies/${movie.id}`} className="w-full">
                        <img
                          src={movie.imageUrl}
                          alt={`${movie.title} poster`}
                          className="w-full aspect-[2/3] object-cover rounded"
                        />
                        <p className="text-sm mt-2 text-center">{movie.title}</p>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-1 text-red-600"
                        onClick={() => removeFromWatchlist(movie.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">Your list is empty. Add movies to watch later.</p>
              )}
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle>Recommended for You</CardTitle>
            </CardHeader>
            <CardContent>
              {recommendations.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {recommendations.map((movie) => (
                    <Link
                      key={movie.id}
                      href={`/movies/${movie.id}`}
                      className="flex flex-col items-center"
                    >
                      <img
                        src={movie.imageUrl}
                        alt={`${movie.title} poster`}
                        className="w-full aspect-[2/3] object-cover rounded"
                      />
                      <p className="text-sm mt-2 text-center">{movie.title}</p>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">Watch some movies to get recommendations!</p>
              )}
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle>Account Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-4">
              <Button variant="outline" className="gap-2" onClick={logout}>
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
              <Button variant="destructive" onClick={deleteAccount}>
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}