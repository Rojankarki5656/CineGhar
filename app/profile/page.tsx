"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trash2, LogOut } from "lucide-react";

type TitleSummary = {
  id: string;
  title: string;
  imageUrl: string;
  year: string;
  rating: string;
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

/** Fetch one title's details from the API */
async function fetchTitle(id: string): Promise<any | null> {
  try {
    const res = await fetch(`${API_BASE}/title/details?title_id=${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data ?? json?.results ?? json;
  } catch {
    return null;
  }
}

function mapSummary(item: any): TitleSummary {
  return {
    id: item.id,
    title: item.title,
    imageUrl: item.image?.link ?? "/placeholder.svg",
    year: item.year ? String(item.year) : "",
    rating: item.rating?.value != null ? String(item.rating.value) : "—",
  };
}

export default function ProfilePage() {
  const [userData, setUserData] = useState({
    name: "User",
    email: "",
    avatar: "/images/avatar.png",
  });
  const [viewingHistory, setViewingHistory] = useState<TitleSummary[]>([]);
  const [watchlist, setWatchlist] = useState<TitleSummary[]>([]);
  const [recommendations, setRecommendations] = useState<TitleSummary[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  /* ---------- Load all data ---------- */
  useEffect(() => {
    const load = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        router.replace("/login");
        return;
      }

      try {

      } catch (err: any) {
        setError(err.message || "Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [router]);

  /* ---------- Save profile ---------- */
  const handleSave = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setError("No user ID found. Please log in.");
      return;
    }

    try {

    } catch (err: any) {
      setError(err.message || "Failed to update user data");
    }
  };

  /* ---------- Clear history ---------- */
  const clearHistory = () => {
    localStorage.setItem("viewingHistory", "[]");
    setViewingHistory([]);
    setRecommendations([]);
  };


  /* ---------- Logout ---------- */
  const logout = async () => {
    try {

    } catch (err: any) {
      setError(err.message || "Failed to log out");
    }
  };

  /* ---------- Delete account ---------- */
  const deleteAccount = async () => {
    if (
      !confirm(
        "Are you sure you want to delete your account? This cannot be undone.",
      )
    )
      return;

    try {
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Failed to delete account");
    }
  };

  /* ---------- Loading state ---------- */
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white">
        <Navbar />
        <main className="px-4 md:px-6 py-8">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="h-9 w-40 rounded bg-zinc-800 animate-pulse" />
            <div className="h-40 rounded-lg bg-zinc-900 animate-pulse" />
            <div className="h-40 rounded-lg bg-zinc-900 animate-pulse" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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

          {/* ---------- User Information ---------- */}
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
                      onChange={(e) =>
                        setUserData({ ...userData, name: e.target.value })
                      }
                      className="bg-zinc-800 border-zinc-700"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userData.email}
                      onChange={(e) =>
                        setUserData({ ...userData, email: e.target.value })
                      }
                      className="bg-zinc-800 border-zinc-700"
                    />
                  </div>
                  <div>
                    <Label htmlFor="avatar">Avatar</Label>
                    <Input
                      id="avatar"
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setAvatarFile(e.target.files?.[0] || null)
                      }
                      className="bg-zinc-800 border-zinc-700"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSave}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={userData.avatar} alt="User avatar" />
                    <AvatarFallback>
                      {userData.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-lg font-medium">{userData.name}</p>
                    <p className="text-gray-400">
                      {userData.email || "—"}
                    </p>
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

          {/* ---------- Viewing History ---------- */}
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
                <TitleGrid
                  titles={viewingHistory}
                  emptyMessage=""
                  onRemove={undefined}
                />
              ) : (
                <p className="text-gray-400">No viewing history yet.</p>
              )}
            </CardContent>
          </Card>

          {/* ---------- Watchlist ---------- */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle>My List</CardTitle>
            </CardHeader>
            <CardContent>
              {watchlist.length > 0 ? (
                <TitleGrid
                  titles={watchlist}
                  emptyMessage=""
                />
              ) : (
                <p className="text-gray-400">
                  Your list is empty. Add movies to watch later.
                </p>
              )}
            </CardContent>
          </Card>

          {/* ---------- Recommendations ---------- */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle>Recommended for You</CardTitle>
            </CardHeader>
            <CardContent>
              {recommendations.length > 0 ? (
                <TitleGrid
                  titles={recommendations}
                  emptyMessage=""
                  onRemove={undefined}
                />
              ) : (
                <p className="text-gray-400">
                  Watch some movies to get recommendations!
                </p>
              )}
            </CardContent>
          </Card>

          {/* ---------- Account Actions ---------- */}
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

/* ---------- Shared grid for profile sections ---------- */
function TitleGrid({
  titles,
  onRemove,
}: {
  titles: TitleSummary[];
  emptyMessage?: string;
  onRemove?: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {titles.map((t) => (
        <div key={t.id} className="flex flex-col items-center">
          <Link href={`/movies/${t.id}`} className="w-full">
            <div className="relative aspect-[2/3] rounded overflow-hidden bg-zinc-800">
              <Image
                src={t.imageUrl}
                alt={`${t.title} poster`}
                fill
                sizes="(max-width: 768px) 50vw, 20vw"
                className="object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg";
                }}
              />
            </div>
            <p className="text-sm mt-2 text-center line-clamp-2">
              {t.title}
            </p>
          </Link>
          {onRemove && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-1 text-red-600 hover:text-red-500"
              onClick={() => onRemove(t.id)}
              aria-label={`Remove ${t.title} from list`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}