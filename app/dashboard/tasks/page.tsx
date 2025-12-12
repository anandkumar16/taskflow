"use client"

import { useState } from "react"
import { useTasks, type Task } from "@/lib/hooks/use-tasks"
import { TaskCard } from "@/components/dashboard/task-card"
import { TaskDialog } from "@/components/dashboard/task-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Loader2, X, Filter, SlidersHorizontal } from "lucide-react"

export default function TasksPage() {
  const {
    tasks,
    isLoading,
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
  } = useTasks()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const handleSave = async (task: Partial<Task>) => {
    if (editingTask) {
      await updateTask(editingTask.id, task)
    } else {
      await createTask(task)
    }
    setEditingTask(null)
  }

  const handleEdit = (task: Task) => {
    setEditingTask(task)
    setDialogOpen(true)
  }

  const handleStatusChange = async (id: number, status: Task["status"]) => {
    await updateTask(id, { status })
  }

  const activeFilterCount = [statusFilter !== "all", priorityFilter !== "all", search !== ""].filter(Boolean).length

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tasks</h1>
          <p className="text-muted-foreground">Manage and organize your tasks</p>
        </div>
        <Button
          onClick={() => {
            setEditingTask(null)
            setDialogOpen(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>

      <div className="rounded-lg border bg-card p-4 space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <SlidersHorizontal className="h-4 w-4" />
          Search & Filters
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFilterCount} active
            </Badge>
          )}
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by title or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-9"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">Status:</span>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-yellow-500" />
                    Pending
                  </div>
                </SelectItem>
                <SelectItem value="in_progress">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-blue-500" />
                    In Progress
                  </div>
                </SelectItem>
                <SelectItem value="completed">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    Completed
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">Priority:</span>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="All Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="high">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-red-500" />
                    High
                  </div>
                </SelectItem>
                <SelectItem value="medium">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-orange-500" />
                    Medium
                  </div>
                </SelectItem>
                <SelectItem value="low">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-gray-500" />
                    Low
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="shrink-0">
              <X className="mr-1 h-4 w-4" />
              Clear all
            </Button>
          )}
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t">
            <span className="text-xs text-muted-foreground">Active filters:</span>
            {search && (
              <Badge variant="outline" className="gap-1">
                Search: "{search}"
                <button onClick={() => setSearch("")} className="ml-1 hover:text-destructive">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {statusFilter !== "all" && (
              <Badge variant="outline" className="gap-1">
                Status: {statusFilter.replace("_", " ")}
                <button onClick={() => setStatusFilter("all")} className="ml-1 hover:text-destructive">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {priorityFilter !== "all" && (
              <Badge variant="outline" className="gap-1">
                Priority: {priorityFilter}
                <button onClick={() => setPriorityFilter("all")} className="ml-1 hover:text-destructive">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Results Count */}
      {!isLoading && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {tasks.length} {tasks.length === 1 ? "task" : "tasks"} found
            {hasActiveFilters && " (filtered)"}
          </span>
        </div>
      )}

      {/* Tasks Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : tasks.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <Filter className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">No tasks found</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {hasActiveFilters
              ? "Try adjusting your search or filters to find what you're looking for"
              : "Create your first task to get started"}
          </p>
          {hasActiveFilters ? (
            <Button className="mt-4 bg-transparent" variant="outline" onClick={clearFilters}>
              Clear all filters
            </Button>
          ) : (
            <Button
              className="mt-4"
              onClick={() => {
                setEditingTask(null)
                setDialogOpen(true)
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Task
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={handleEdit}
              onDelete={deleteTask}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}

      <TaskDialog open={dialogOpen} onOpenChange={setDialogOpen} task={editingTask} onSave={handleSave} />
    </div>
  )
}
