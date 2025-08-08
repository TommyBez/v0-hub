import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from '@clerk/nextjs'
import { GitBranch, Key } from 'lucide-react'
import Link from 'next/link'
import { Animated } from '@/components/animated'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/">
          <Animated
            as="span"
            className="flex items-center space-x-2"
            hoverScale={1.01}
            tapScale={0.99}
          >
            <GitBranch className="h-6 w-6" />
            <span className="font-bold text-xl">v0hub</span>
          </Animated>
        </Link>
        <div className="flex items-center gap-4">
          <SignedIn>
            <Link href="/tokens">
              <Animated as="div" hoverScale={1.02} tapScale={0.98}>
                <Button className="gap-2" size="sm" variant="ghost">
                  <Key className="h-4 w-4" />
                  <span className="hidden sm:inline">API Token</span>
                </Button>
              </Animated>
            </Link>
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <Animated as="div" hoverScale={1.02} tapScale={0.98}>
                <Button size="sm" type="button" variant="link">
                  Sign In
                </Button>
              </Animated>
            </SignInButton>
            <SignUpButton mode="modal">
              <Animated as="div" hoverScale={1.02} tapScale={0.98}>
                <Button size="sm" type="button" variant="link">
                  Sign Up
                </Button>
              </Animated>
            </SignUpButton>
          </SignedOut>
          <Animated as="div" hoverScale={1.02} tapScale={0.98}>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </Animated>
          <Animated as="div" hoverScale={1.02} tapScale={0.98}>
            <ThemeToggle />
          </Animated>
        </div>
      </div>
    </header>
  )
}
