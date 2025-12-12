import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const result = await sql`
      SELECT * FROM tasks WHERE id = ${id} AND user_id = ${session.userId}
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    return NextResponse.json({ task: result[0] })
  } catch (error) {
    console.error("Get task error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const { title, description, status, priority, due_date } = await request.json()

    const result = await sql`
      UPDATE tasks 
      SET 
        title = COALESCE(${title}, title),
        description = COALESCE(${description}, description),
        status = COALESCE(${status}, status),
        priority = COALESCE(${priority}, priority),
        due_date = COALESCE(${due_date}, due_date),
        updated_at = NOW()
      WHERE id = ${id} AND user_id = ${session.userId}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    return NextResponse.json({ task: result[0] })
  } catch (error) {
    console.error("Update task error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const result = await sql`
      DELETE FROM tasks WHERE id = ${id} AND user_id = ${session.userId}
      RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Task deleted successfully" })
  } catch (error) {
    console.error("Delete task error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
