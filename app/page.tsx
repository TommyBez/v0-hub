"use client"

import RepositorySelectionCard from "@/components/repository-selection-card"
import { Code2, Zap, GitBranch, Sparkles, Users, Shield } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function HomePage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] w-full flex-col">
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
                Turn any GitHub repo into
                <span className="block text-primary">an AI conversation</span>
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
                Bootstrap intelligent v0 chat instances from public repositories. Explore codebases, 
                understand architecture, and get AI-powered insights in seconds.
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

      {/* Features Section */}
      <section className="px-4 py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Why developers love v0hub
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              The fastest way to understand and explore any codebase with AI assistance
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="group relative overflow-hidden rounded-xl border bg-card p-6 transition-all hover:shadow-lg hover:shadow-primary/5">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative space-y-3">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold">Instant Setup</h3>
                <p className="text-muted-foreground">
                  No configuration needed. Just paste a GitHub URL and start chatting with the codebase immediately.
                </p>
              </div>
            </div>
            
            {/* Feature 2 */}
            <div className="group relative overflow-hidden rounded-xl border bg-card p-6 transition-all hover:shadow-lg hover:shadow-primary/5">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative space-y-3">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Code2 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold">Deep Code Understanding</h3>
                <p className="text-muted-foreground">
                  AI-powered insights help you navigate complex codebases, understand patterns, and find what you need.
                </p>
              </div>
            </div>
            
            {/* Feature 3 */}
            <div className="group relative overflow-hidden rounded-xl border bg-card p-6 transition-all hover:shadow-lg hover:shadow-primary/5">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative space-y-3">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <GitBranch className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold">Branch Support</h3>
                <p className="text-muted-foreground">
                  Explore any branch of your repository. Perfect for understanding different versions or features.
                </p>
              </div>
            </div>
            
            {/* Feature 4 */}
            <div className="group relative overflow-hidden rounded-xl border bg-card p-6 transition-all hover:shadow-lg hover:shadow-primary/5">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative space-y-3">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold">Team Collaboration</h3>
                <p className="text-muted-foreground">
                  Share v0 chat sessions with your team to onboard developers faster and document insights.
                </p>
              </div>
            </div>
            
            {/* Feature 5 */}
            <div className="group relative overflow-hidden rounded-xl border bg-card p-6 transition-all hover:shadow-lg hover:shadow-primary/5">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative space-y-3">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold">Secure & Private</h3>
                <p className="text-muted-foreground">
                  Your conversations are private. We only access public repositories you explicitly choose to explore.
                </p>
              </div>
            </div>
            
            {/* Feature 6 */}
            <div className="group relative overflow-hidden rounded-xl border bg-card p-6 transition-all hover:shadow-lg hover:shadow-primary/5">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative space-y-3">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold">v0 Intelligence</h3>
                <p className="text-muted-foreground">
                  Leverage the power of v0's AI to get contextual answers, code explanations, and suggestions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 md:py-24">
        <div className="container mx-auto max-w-4xl text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to explore your codebase?
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Join thousands of developers who use v0hub to understand codebases faster.
              It's free to get started.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Badge variant="outline" className="text-sm">
              <Users className="mr-2 h-3.5 w-3.5" />
              10,000+ developers
            </Badge>
            <Badge variant="outline" className="text-sm">
              <GitBranch className="mr-2 h-3.5 w-3.5" />
              50,000+ repos explored
            </Badge>
            <Badge variant="outline" className="text-sm">
              <Zap className="mr-2 h-3.5 w-3.5" />
              Instant setup
            </Badge>
          </div>
        </div>
      </section>
    </div>
  )
}
