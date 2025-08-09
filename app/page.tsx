import { Sparkles } from 'lucide-react'
import RepositorySelectionCard from '@/components/repository-selection-card'
import { Badge } from '@/components/ui/badge'

export default function HomePage() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] w-full flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background px-4 py-16 md:py-24">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="-top-40 -right-40 absolute h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="-bottom-40 -left-40 absolute h-80 w-80 rounded-full bg-primary/5 blur-3xl" />

        <div className="container relative mx-auto max-w-6xl">
          <div className="flex flex-col items-center space-y-8 text-center">
            {/* Badge */}
            <Badge
              className="animate-fade-in px-4 py-1.5 text-sm"
              variant="secondary"
            >
              <Sparkles className="mr-2 h-3.5 w-3.5" />
              Powered by v0 sdk and GitHub
            </Badge>

            {/* Main headline */}
            <div className="animation-delay-150 animate-fade-in space-y-4">
              <h1 className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text font-bold text-4xl text-transparent tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                Work on any GitHub repo
                <span className="block text-primary">with v0 agent</span>
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
                Bootstrap a v0 chat from any public GitHub repository. Let AI
                help you understand, modify, and improve codebases with
                intelligent assistance.
              </p>
            </div>

            {/* Main CTA Card */}
            <div className="animation-delay-300 w-full max-w-2xl animate-fade-in">
              <RepositorySelectionCard showHeader={false} />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
