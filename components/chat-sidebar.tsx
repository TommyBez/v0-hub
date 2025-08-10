import { Suspense } from 'react'
import { getCachedUser, chats } from '@/db/queries'
import type { Chat } from '@/db/schema'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarSeparator,
} from '@/components/ui/sidebar'
import { MessageSquare, Lock, Globe, ExternalLink } from 'lucide-react'
import Link from 'next/link'

// Chat item component
function ChatItem({ chat }: { chat: Chat }) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link href={`/chat/${chat.v0id}`} className="group">
          <MessageSquare className="h-4 w-4 shrink-0" />
          <div className="flex-1 overflow-hidden">
            <div className="truncate font-medium">
              {chat.v0id}
            </div>
            <div className="truncate text-xs text-muted-foreground">
              {new Date(chat.createdAt).toLocaleDateString()}
            </div>
          </div>
          <ExternalLink className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

// Server component that fetches chat data
async function ChatList({ userId, owned }: { userId: string; owned: boolean }) {
  const userChats = owned
    ? await chats.getUserOwnedChats(userId)
    : await chats.getUserPublicChats(userId)

  if (userChats.length === 0) {
    return (
      <div className="px-3 py-2 text-sm text-muted-foreground">
        No {owned ? 'private' : 'public'} chats yet
      </div>
    )
  }

  return (
    <SidebarMenu>
      {userChats.map((chat) => (
        <ChatItem key={chat.id} chat={chat} />
      ))}
    </SidebarMenu>
  )
}

// Loading skeleton component
function ChatListSkeleton() {
  return (
    <SidebarMenu>
      <SidebarMenuSkeleton />
      <SidebarMenuSkeleton />
      <SidebarMenuSkeleton />
    </SidebarMenu>
  )
}

// Main sidebar component
export async function ChatSidebar() {
  const user = await getCachedUser()

  if (!user) {
    return null
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="px-4">
          <h2 className="text-lg font-semibold">Your Chats</h2>
          <p className="text-xs text-muted-foreground">
            Manage your v0 chat sessions
          </p>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {/* Private Chats */}
        <SidebarGroup>
          <SidebarGroupLabel>
            <Lock className="mr-2 h-4 w-4" />
            Private Chats
            <span className="ml-auto text-xs text-muted-foreground">
              Created with your API key
            </span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <Suspense fallback={<ChatListSkeleton />}>
              <ChatList userId={user.id} owned={true} />
            </Suspense>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Public Chats */}
        <SidebarGroup>
          <SidebarGroupLabel>
            <Globe className="mr-2 h-4 w-4" />
            Public Chats
            <span className="ml-auto text-xs text-muted-foreground">
              Shared sessions
            </span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <Suspense fallback={<ChatListSkeleton />}>
              <ChatList userId={user.id} owned={false} />
            </Suspense>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}