'use client'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import { Key } from 'lucide-react'
import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'

export function HeaderButtons() {
  const segment = useSelectedLayoutSegment()

  if (segment !== 'dashboard') {
    return <ThemeToggle />
  }
  return (
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
  )
}
