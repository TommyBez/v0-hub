import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import { GitBranch, Key } from 'lucide-react'
import Link from 'next/link'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link className="flex items-center space-x-2" href="/">
          <GitBranch className="h-6 w-6" />
          <span className="font-bold text-xl">v0hub</span>
        </Link>
        <div className="flex items-center gap-4">
          <SignedIn>
            <Link href="/token">
              <Button className="gap-2" size="sm" variant="ghost">
                <Key className="h-4 w-4" />
                <span className="hidden sm:inline">API Key</span>
              </Button>
            </Link>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <Button size="sm" type="button" variant="link">
                Sign In
              </Button>
            </SignInButton>
          </SignedOut>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
