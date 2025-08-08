import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import type React from 'react'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { Analytics } from '@vercel/analytics/next'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import UserPrefetch from '@/components/user-prefetch'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'v0hub - GitHub Repository Bootstrapper',
  description: 'Bootstrap a v0 chat from a GitHub repository.',
  generator: 'v0.dev',
}

// Force dynamic rendering for all pages since we're using authentication
export const dynamic = 'force-dynamic'

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <UserPrefetch />
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            disableTransitionOnChange
          >
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
