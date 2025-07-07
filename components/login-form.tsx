"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Client-side validation
    if (!email || !password) {
      setError("Email dan password harus diisi")
      setLoading(false)
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Format email tidak valid")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          password: password.trim(),
        }),
      })

      let data: any = {}
      try {
        // Some server-side errors return plain text instead of JSON.
        if (response.headers.get("content-type")?.includes("application/json")) {
          data = await response.json()
        } else {
          const text = await response.text()
          data = { error: text || "Internal server error" }
        }
      } catch {
        // Fallback for invalid JSON
        const text = await response.text().catch(() => "")
        data = { error: text || "Internal server error" }
      }

      if (response.ok && data.success) {
        router.push("/dashboard")
        router.refresh()
      } else {
        setError(data.error || "Login gagal")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("Terjadi kesalahan jaringan")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@school.com"
          required
          disabled={loading}
          autoComplete="email"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Masukkan password"
          required
          disabled={loading}
          autoComplete="current-password"
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Memproses...
          </>
        ) : (
          "Masuk"
        )}
      </Button>

      <div className="text-sm text-gray-600 space-y-1 p-4 bg-gray-50 rounded-lg">
        <p className="font-semibold">Demo Accounts:</p>
        <div className="space-y-1">
          <p>
            <strong>Admin:</strong> admin@school.com / admin123
          </p>
          <p>
            <strong>Guru:</strong> budi@school.com / guru123
          </p>
          <p>
            <strong>Murid:</strong> ahmad@school.com / murid123
          </p>
        </div>
      </div>
    </form>
  )
}
