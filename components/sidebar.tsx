import type React from 'react'
import { Suspense } from 'react'
import Link from 'next/link'
import { getCachedUser, chats } from '@/db/queries'
import {
  Sidebar as UISidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarProvider,
  SidebarRail,
} from '@/components/ui/sidebar'

async function ChatItem({ id }: { id: string }) {
  const chat = await chats.getById(id)
  if (!chat) return null
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link href={`/chats/${chat.id}`}>{chat.v0id}</Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

function ChatItemFallback() {
  return <SidebarMenuSkeleton className="h-7" />
}

export default async function AppSidebar({ children }: { children: React.ReactNode }) {
  const user = await getCachedUser()

  return (
    <SidebarProvider>
      <UISidebar>
        <SidebarHeader>
          <div className="px-2 py-2 text-sm font-medium">Your Chats</div>
        </SidebarHeader>
        <SidebarContent>
          {user ? (
            <>
              {/* Private chats section */}
              <SidebarGroup>
                <SidebarGroupLabel>Private</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <Suspense
                      fallback={
                        <>
                          <ChatItemFallback />
                          <ChatItemFallback />
                          <ChatItemFallback />
                        </>
                      }
                    >
                      {/* We only fetch IDs in the list call, then fetch each chat via getById to leverage granular streaming */}
                      {/* eslint-disable-next-line react/jsx-key */}
                      {(await (async () => {
                        const { privateChats } = await chats.listByUser(user.id)
                        return privateChats
                      })()).map((c) => (
                        <Suspense key={c.id} fallback={<ChatItemFallback />}>
                          {/* Fetch individual chat info on the server */}
                          {/* eslint-disable-next-line react/no-children-prop */}
                          <ChatItem id={c.id} />
                        </Suspense>
                      ))}
                    </Suspense>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              {/* Public chats section */}
              <SidebarGroup>
                <SidebarGroupLabel>Public</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <Suspense
                      fallback={
                        <>
                          <ChatItemFallback />
                          <ChatItemFallback />
                          <ChatItemFallback />
                        </>
                      }
                    >
                      {(await (async () => {
                        const { publicChats } = await chats.listByUser(user.id)
                        return publicChats
                      })()).map((c) => (
                        <Suspense key={c.id} fallback={<ChatItemFallback />}>
                          <ChatItem id={c.id} />
                        </Suspense>
                      ))}
                    </Suspense>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </>
          ) : (
            <div className="px-2 py-2 text-sm text-muted-foreground">Sign in to view chats</div>
          )}
        </SidebarContent>
        <SidebarFooter>
          <div className="px-2 py-2 text-xs text-muted-foreground">v0hub</div>
        </SidebarFooter>
        <SidebarRail />
      </UISidebar>
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  )
}