import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/auth"

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name } = await request.json()

    const result = await sql`
      UPDATE users 
      SET name = ${name}, updated_at = NOW()
      WHERE id = ${session.userId}
      RETURNING id, email, name, created_at, updated_at
    `

    return NextResponse.json({ user: result[0] })
  } catch (error) {
    console.error("Update user error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
