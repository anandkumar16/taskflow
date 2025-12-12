import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckSquare, Shield, Zap, Users } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <CheckSquare className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">TaskFlow</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign in</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <section className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Manage your tasks
            <br />
            <span className="text-primary">effortlessly</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            TaskFlow helps you organize, prioritize, and track your tasks with a clean, intuitive interface. Stay
            productive and never miss a deadline.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link href="/signup">
              <Button size="lg">Signup</Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline">
                Sign in
              </Button>
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="border-t bg-muted/50 py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-center text-3xl font-bold">Why TaskFlow?</h2>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              <div className="rounded-lg border bg-card p-6">
                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Fast & Intuitive</h3>
                <p className="text-muted-foreground">
                  Create, update, and organize tasks in seconds with our streamlined interface.
                </p>
              </div>
              <div className="rounded-lg border bg-card p-6">
                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Secure</h3>
                <p className="text-muted-foreground">
                  Your data is protected with industry-standard encryption and secure authentication.
                </p>
              </div>
              <div className="rounded-lg border bg-card p-6">
                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Personal</h3>
                <p className="text-muted-foreground">
                  Your own private workspace to manage tasks and boost productivity.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} TaskFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
