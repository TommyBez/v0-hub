import Link from "next/link"
import { GitBranch } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <GitBranch className="h-6 w-6" />
          <span className="font-bold text-xl">v0hub</span>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  )
}