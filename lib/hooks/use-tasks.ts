"use client"

import useSWR from "swr"
import { useCallback, useState, useEffect } from "react"

export interface Task {
  id: number
  user_id: number
  title: string
  description: string | null
  status: "pending" | "in_progress" | "completed"
  priority: "low" | "medium" | "high"
  due_date: string | null
  created_at: string
  updated_at: string
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error("Failed to fetch")
  return res.json()
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export function useTasks() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")

  const debouncedSearch = useDebounce(search, 300)

  const queryParams = new URLSearchParams()
  if (debouncedSearch) queryParams.set("search", debouncedSearch)
  if (statusFilter !== "all") queryParams.set("status", statusFilter)
  if (priorityFilter !== "all") queryParams.set("priority", priorityFilter)

  const { data, error, isLoading, mutate } = useSWR<{ tasks: Task[] }>(`/api/tasks?${queryParams.toString()}`, fetcher)

  const clearFilters = useCallback(() => {
    setSearch("")
    setStatusFilter("all")
    setPriorityFilter("all")
  }, [])

  const hasActiveFilters = search !== "" || statusFilter !== "all" || priorityFilter !== "all"

  const createTask = useCallback(
    async (task: Partial<Task>) => {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to create task")
      }

      await mutate()
      return res.json()
    },
    [mutate],
  )

  const updateTask = useCallback(
    async (id: number, task: Partial<Task>) => {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to update task")
      }

      await mutate()
      return res.json()
    },
    [mutate],
  )

  const deleteTask = useCallback(
    async (id: number) => {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to delete task")
      }

      await mutate()
      return res.json()
    },
    [mutate],
  )

  return {
    tasks: data?.tasks || [],
    isLoading,
    error,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    hasActiveFilters,
    clearFilters,
    createTask,
    updateTask,
    deleteTask,
    refresh: mutate,
  }
}
