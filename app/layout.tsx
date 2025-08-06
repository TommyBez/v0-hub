import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { cache } from "react"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { Analytics } from '@vercel/analytics/next'
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ClerkProvider, currentUser } from "@clerk/nextjs"
import { findOrCreateUser } from "@/db/queries"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "v0hub - GitHub Repository Bootstrapper",
  description: "Bootstrap a v0 chat from a GitHub repository.",
  generator: "v0.dev",
}

// Create a cached version of findOrCreateUser
const cachedFindOrCreateUser = cache(findOrCreateUser)

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Sync user with database if authenticated
  const user = await currentUser()
  if (user && user.emailAddresses?.[0]?.emailAddress) {
    try {
      await cachedFindOrCreateUser({
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
      })
    } catch (error) {
      // Log error but don't block rendering
      console.error('Error syncing user with database:', error)
    }
  }

  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystemTransition disableTransitionOnChange>
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster richColors />
          </ThemeProvider>
          <Analytics mode="production" />
        </body>
      </html>
    </ClerkProvider>
  )
}
