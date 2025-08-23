import { Sparkles } from 'lucide-react'
import type { SearchParams } from 'nuqs/server'
import RepositorySelectionCard from '@/components/repository-selection-card'
import { Badge } from '@/components/ui/badge'
import { searchParamsCache } from '@/lib/search-params'

type PageProps = {
  searchParams: Promise<SearchParams> // Next.js 15+: async searchParams prop
}

export default async function HomePage({ searchParams }: PageProps) {
  await searchParamsCache.parse(searchParams)
  return (
    <div className="flex min-h-[calc(100vh-8rem)] w-full flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background px-4 py-16 md:py-24">
        <div className="container relative mx-auto max-w-6xl">
          <div className="flex flex-col items-center space-y-8 text-center">
            {/* Badge */}
            <Badge className="px-4 py-1.5 text-sm" variant="secondary">
              <Sparkles className="mr-2 h-3.5 w-3.5" />
              Powered by v0 sdk and GitHub
            </Badge>

            {/* Main headline */}
            <div className="space-y-4">
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
            <div className="w-full max-w-2xl">
              <RepositorySelectionCard />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
