import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status")
    const priority = searchParams.get("priority")

    let tasks
    if (status && status !== "all" && priority && priority !== "all") {
      tasks = await sql`
        SELECT * FROM tasks 
        WHERE user_id = ${session.userId}
        AND (title ILIKE ${"%" + search + "%"} OR description ILIKE ${"%" + search + "%"})
        AND status = ${status}
        AND priority = ${priority}
        ORDER BY created_at DESC
      `
    } else if (status && status !== "all") {
      tasks = await sql`
        SELECT * FROM tasks 
        WHERE user_id = ${session.userId}
        AND (title ILIKE ${"%" + search + "%"} OR description ILIKE ${"%" + search + "%"})
        AND status = ${status}
        ORDER BY created_at DESC
      `
    } else if (priority && priority !== "all") {
      tasks = await sql`
        SELECT * FROM tasks 
        WHERE user_id = ${session.userId}
        AND (title ILIKE ${"%" + search + "%"} OR description ILIKE ${"%" + search + "%"})
        AND priority = ${priority}
        ORDER BY created_at DESC
      `
    } else {
      tasks = await sql`
        SELECT * FROM tasks 
        WHERE user_id = ${session.userId}
        AND (title ILIKE ${"%" + search + "%"} OR description ILIKE ${"%" + search + "%"})
        ORDER BY created_at DESC
      `
    }

    return NextResponse.json({ tasks })
  } catch (error) {
    console.error("Get tasks error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, description, status, priority, due_date } = await request.json()

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO tasks (user_id, title, description, status, priority, due_date)
      VALUES (${session.userId}, ${title}, ${description || null}, ${status || "pending"}, ${priority || "medium"}, ${due_date || null})
      RETURNING *
    `

    return NextResponse.json({ task: result[0] }, { status: 201 })
  } catch (error) {
    console.error("Create task error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
