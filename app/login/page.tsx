"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { supabase } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Lock, Mail } from "lucide-react"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Validation
    if (!email.trim()) {
      setError("Email is required")
      setLoading(false)
      return
    }

    if (!password) {
      setError("Password is required")
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }

      if (data.user) {
        // Save user ID to local storage
        localStorage.setItem("userId", data.user.id)
        router.push("/home") // Redirect to home page
      }
    } catch (err) {
      setError("An unexpected error occurred")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black bg-[url('/images/auth-background.png')] bg-cover bg-center">
      <div className="min-h-screen bg-black/60">
        <header className="p-4 md:p-6">
          <Link href="/">
            <h1 className="text-2xl md:text-3xl font-bold text-red-600">CineGhar</h1>
          </Link>
        </header>

        <main className="flex justify-center items-center px-4 py-10">
          <div className="w-full max-w-md p-6 md:p-8 bg-black/80 rounded-lg">
            <h2 className="text-3xl font-bold text-white mb-8">Sign In</h2>

            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-500 p-3 rounded-md mb-6">
                {error}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleLogin}>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10 bg-zinc-800 border-zinc-700 text-white"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="password" className="text-white">
                    Password
                  </Label>
                  <Link href="#" className="text-sm text-gray-400 hover:text-white">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="pl-10 pr-10 bg-zinc-800 border-zinc-700 text-white"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-gray-400"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white py-6"
                disabled={loading}
              >
                {loading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-400">
                New to CineGhar?{" "}
                <Link href="/signup" className="text-white hover:underline">
                  Sign up now
                </Link>
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}