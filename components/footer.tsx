import Link from "next/link"
import { Linkedin } from "lucide-react"
import { SiX } from "@icons-pack/react-simple-icons"

export function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold">v0hub</span>
          </Link>
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built with ❤️ for the developer community
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link
            href="https://x.com/TommyBez85"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            aria-label="Follow on X (Twitter)"
          >
            <SiX className="h-5 w-5" />
          </Link>
          <Link
            href="https://www.linkedin.com/in/tcarnemolla"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            aria-label="Connect on LinkedIn"
          >
            <Linkedin className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </footer>
  )
}