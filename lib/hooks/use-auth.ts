"use client"

import useSWR from "swr"
import { useRouter } from "next/navigation"
import { useCallback } from "react"

interface User {
  id: number
  email: string
  name: string | null
  created_at: string
  updated_at: string
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    const error = new Error("Failed to fetch")
    throw error
  }
  return res.json()
}

export function useAuth() {
  const router = useRouter()
  const { data, error, isLoading, mutate } = useSWR<{ user: User }>("/api/user/me", fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  })

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Login failed")
      }

      await mutate()
      router.push("/dashboard")
      return data
    },
    [mutate, router],
  )

  const signup = useCallback(
    async (email: string, password: string, name?: string) => {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Signup failed")
      }

      await mutate()
      router.push("/dashboard")
      return data
    },
    [mutate, router],
  )

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    await mutate(undefined, { revalidate: false })
    router.push("/login")
  }, [mutate, router])

  const updateProfile = useCallback(
    async (name: string) => {
      const res = await fetch("/api/user/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Update failed")
      }

      await mutate()
      return data
    },
    [mutate],
  )

  return {
    user: data?.user,
    isLoading,
    isAuthenticated: !!data?.user && !error,
    login,
    signup,
    logout,
    updateProfile,
  }
}
