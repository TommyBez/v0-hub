import { SiGithub, SiX } from '@icons-pack/react-simple-icons'
import { Linkedin } from 'lucide-react'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <p className="text-center text-muted-foreground text-sm leading-loose md:text-left">
          Built with ❤️ for the developer community
        </p>

        <div className="flex items-center space-x-4">
          <Link
            aria-label="GitHub"
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            href="https://github.com/TommyBez/v0-hub"
            rel="noopener noreferrer"
            target="_blank"
          >
            <SiGithub className="h-5 w-5" />
          </Link>
          <Link
            aria-label="Follow on X (Twitter)"
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            href="https://x.com/TommyBez85"
            rel="noopener noreferrer"
            target="_blank"
          >
            <SiX className="h-5 w-5" />
          </Link>
          <Link
            aria-label="Connect on LinkedIn"
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            href="https://www.linkedin.com/in/tcarnemolla"
            rel="noopener noreferrer"
            target="_blank"
          >
            <Linkedin className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </footer>
  )
}
