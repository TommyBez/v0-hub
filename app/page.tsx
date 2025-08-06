"use client"

import RepositorySelectionCard from "@/components/repository-selection-card"
import { Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { SignedIn, SignedOut } from "@clerk/nextjs"
import { UserProfile } from "@/components/user-profile"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] w-full flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background px-4 py-16 md:py-24">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        
        <div className="container relative mx-auto max-w-6xl">
          <div className="flex flex-col items-center text-center space-y-8">
            {/* Badge */}
            <Badge variant="secondary" className="px-4 py-1.5 text-sm animate-fade-in">
              <Sparkles className="mr-2 h-3.5 w-3.5" />
              Powered by v0 sdk and GitHub
            </Badge>
            
            {/* Main headline */}
            <div className="space-y-4 animate-fade-in animation-delay-150">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Work on any GitHub repo
                <span className="block text-primary">with v0 agent</span>
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
                Bootstrap a v0 chat from any public GitHub repository. Let AI help you understand, 
                modify, and improve codebases with intelligent assistance.
              </p>
            </div>
            
            {/* Authentication Status */}
            <div className="w-full max-w-2xl space-y-4">
              <SignedIn>
                <UserProfile />
                <Link href="/protected" className="text-sm text-primary hover:underline">
                  Visit protected page →
                </Link>
              </SignedIn>
              
              <SignedOut>
                <div className="p-4 border rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">
                    Sign in to access personalized features and save your projects.
                  </p>
                </div>
              </SignedOut>
            </div>
            
            {/* Main CTA Card */}
            <div className="w-full max-w-2xl animate-fade-in animation-delay-300">
              <RepositorySelectionCard
                showHeader={false}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
