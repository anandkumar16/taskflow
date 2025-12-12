import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { createToken, hashPassword } from "@/lib/auth"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    // Validation
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    // Check if user exists
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email.toLowerCase()}
    `

    if (existingUser.length > 0) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 })
    }

    // Hash password and create user
    const passwordHash = await hashPassword(password)
    const result = await sql`
      INSERT INTO users (email, password_hash, name)
      VALUES (${email.toLowerCase()}, ${passwordHash}, ${name || null})
      RETURNING id, email, name, created_at
    `

    const user = result[0]

    // Create JWT token
    const token = await createToken({ userId: user.id, email: user.email })

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    return NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name },
      message: "Account created successfully",
    })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
