"use client"

import RepositorySelectionCard from "@/components/repository-selection-card"
import { Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"

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
              Powered by v0 and GitHub
            </Badge>
            
            {/* Main headline */}
            <div className="space-y-4 animate-fade-in animation-delay-150">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Explore GitHub repositories
                <span className="block text-primary">with v0</span>
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
                Enter a GitHub repository URL, select a branch, and create a v0 chat instance 
                to explore and understand the codebase.
              </p>
            </div>
            
            {/* Main CTA Card */}
            <div className="w-full max-w-2xl animate-fade-in animation-delay-300">
              <RepositorySelectionCard
                title="Start Exploring"
                description="Enter any public GitHub repository URL and select a branch to begin."
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
