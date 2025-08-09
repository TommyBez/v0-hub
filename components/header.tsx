import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import { Key } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 w-full items-center justify-between px-4 md:px-6 lg:px-8">
        <Link className="flex items-center space-x-2" href="/">
          <Image
            alt="v0hub Logo"
            className="h-28 w-auto dark:invert"
            height={100}
            priority
            src="/v0-hub-logo-text-transparent.png"
            width={100}
          />
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
