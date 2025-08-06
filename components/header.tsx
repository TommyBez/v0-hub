import Link from "next/link"
import { GitBranch } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs"
import { Suspense } from "react"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <GitBranch className="h-6 w-6" />
          <span className="font-bold text-xl">v0hub</span>
        </Link>
        <div className="flex items-center gap-4">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="text-sm font-medium hover:underline underline-offset-4">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="text-sm font-medium hover:underline underline-offset-4">
                Sign Up
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <Suspense
              fallback={
                <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
              }
            >
              <UserButton afterSignOutUrl="/" />
            </Suspense>
          </SignedIn>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}