"use client"

import { useState } from "react"
import type { Task } from "@/lib/hooks/use-tasks"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Trash2, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (id: number) => void
  onStatusChange: (id: number, status: Task["status"]) => void
}

const statusColors = {
  pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  in_progress: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  completed: "bg-green-500/10 text-green-600 border-green-500/20",
}

const priorityColors = {
  low: "bg-slate-500/10 text-slate-600 border-slate-500/20",
  medium: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  high: "bg-red-500/10 text-red-600 border-red-500/20",
}

export function TaskCard({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await onDelete(task.id)
    } finally {
      setIsDeleting(false)
    }
  }

  const formatDate = (date: string | null) => {
    if (!date) return null
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <Card className="group transition-shadow hover:shadow-md">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex-1 space-y-1">
          <h3 className="font-semibold leading-none tracking-tight">{task.title}</h3>
          {task.description && <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(task)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Badge variant="outline" className={cn("cursor-pointer capitalize", statusColors[task.status])}>
                {task.status.replace("_", " ")}
              </Badge>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => onStatusChange(task.id, "pending")}>Pending</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusChange(task.id, "in_progress")}>In Progress</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusChange(task.id, "completed")}>Completed</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Badge variant="outline" className={cn("capitalize", priorityColors[task.priority])}>
            {task.priority}
          </Badge>
          {task.due_date && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {formatDate(task.due_date)}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
