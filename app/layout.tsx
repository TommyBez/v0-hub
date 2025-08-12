import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import type { ReactNode } from 'react'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { Analytics } from '@vercel/analytics/next'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { ChatSidebar } from '@/components/chat-sidebar'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { ThemeProvider } from '@/components/theme-provider'
import { SidebarProvider } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/sonner'
import UserPrefetch from '@/components/user-prefetch'
import ReactQueryProvider from '@/providers/react-query'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'v0hub - v0 GitHub Bootstrapper',
  description: 'Bootstrap a v0 chat from a GitHub repository.',
  generator: 'v0.dev',
}

// Force dynamic rendering for all pages since we're using authentication
export const dynamic = 'force-dynamic'

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <NuqsAdapter>
            <ReactQueryProvider>
              <UserPrefetch />
              <ThemeProvider
                attribute="class"
                defaultTheme="light"
                disableTransitionOnChange
              >
                <SidebarProvider defaultOpen={false}>
                  <div className="relative flex min-h-screen w-full">
                    <ChatSidebar />
                    <div className="flex flex-1 flex-col">
                      <Header />
                      <main className="flex-1">{children}</main>
                      <Footer />
                    </div>
                  </div>
                </SidebarProvider>
                <Toaster richColors />
              </ThemeProvider>
            </ReactQueryProvider>
            <Analytics mode="production" />
          </NuqsAdapter>
        </body>
      </html>
    </ClerkProvider>
  )
}
