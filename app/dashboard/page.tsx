"use client"

import { useTasks } from "@/lib/hooks/use-tasks"
import { useAuth } from "@/lib/hooks/use-auth"
import { StatsCard } from "@/components/dashboard/stats-card"
import { TaskCard } from "@/components/dashboard/task-card"
import { TaskDialog } from "@/components/dashboard/task-dialog"
import { Button } from "@/components/ui/button"
import { CheckSquare, Clock, AlertCircle, CheckCircle, Plus } from "lucide-react"
import { useState } from "react"
import type { Task } from "@/lib/hooks/use-tasks"
import Link from "next/link"

export default function DashboardPage() {
  const { user } = useAuth()
  const { tasks, createTask, updateTask, deleteTask } = useTasks()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const pendingCount = tasks.filter((t) => t.status === "pending").length
  const inProgressCount = tasks.filter((t) => t.status === "in_progress").length
  const completedCount = tasks.filter((t) => t.status === "completed").length

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

  const recentTasks = tasks.slice(0, 5)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user?.name || "User"}</h1>
        <p className="text-muted-foreground">Here&apos;s an overview of your tasks</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatsCard title="Total Tasks" value={tasks.length} icon={<CheckSquare className="h-4 w-4" />} />
        <StatsCard title="Pending" value={pendingCount} icon={<Clock className="h-4 w-4" />} />
        <StatsCard title="In Progress" value={inProgressCount} icon={<AlertCircle className="h-4 w-4" />} />
        <StatsCard title="Completed" value={completedCount} icon={<CheckCircle className="h-4 w-4" />} />
      </div>

      {/* Recent Tasks */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Tasks</h2>
          <div className="flex gap-2">
            <Button
              onClick={() => {
                setEditingTask(null)
                setDialogOpen(true)
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              New Task
            </Button>
            <Link href="/dashboard/tasks">
              <Button variant="outline">View All</Button>
            </Link>
          </div>
        </div>

        {recentTasks.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <CheckSquare className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No tasks yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">Create your first task to get started</p>
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
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recentTasks.map((task) => (
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
      </div>

      <TaskDialog open={dialogOpen} onOpenChange={setDialogOpen} task={editingTask} onSave={handleSave} />
    </div>
  )
}
