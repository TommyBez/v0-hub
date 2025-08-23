import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import type { ReactNode } from 'react'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { Analytics } from '@vercel/analytics/next'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import UserPrefetch from '@/components/user-prefetch'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'v0hub - v0 GitHub Bootstrapper',
  description: 'Bootstrap a v0 chat from a GitHub repository.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <NuqsAdapter>
      <ClerkProvider>
        <UserPrefetch />
        <html lang="en" suppressHydrationWarning>
          <body className={inter.className}>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              disableTransitionOnChange
            >
              {children}
              <Toaster richColors />
            </ThemeProvider>
            <Analytics mode="production" />
          </body>
        </html>
      </ClerkProvider>
    </NuqsAdapter>
  )
}
