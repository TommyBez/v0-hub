import { Suspense } from 'react'
import { getCachedUser, chats, getDecryptedV0Token } from '@/db/queries'
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
import { createClient } from 'v0-sdk'

// Interface for v0 chat metadata
interface V0ChatMetadata {
  id: string
  title?: string
  description?: string
  createdAt?: string
  url?: string
}

// Fetch chat metadata from v0
async function fetchV0ChatMetadata(v0id: string, token: string | null): Promise<V0ChatMetadata | null> {
  if (!token) return null
  
  try {
    const client = createClient(token)
    // Note: The actual API might differ - this is a placeholder
    // You'll need to check the v0 SDK documentation for the correct method
    const chatData = await client.chats.get(v0id)
    return chatData as V0ChatMetadata
  } catch (error) {
    console.error(`Failed to fetch v0 chat metadata for ${v0id}:`, error)
    return null
  }
}

// Chat item component with metadata
async function ChatItem({ chat, token }: { chat: Chat; token: string | null }) {
  const metadata = await fetchV0ChatMetadata(chat.v0id, token)
  
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link href={`/chat/${chat.v0id}`} className="group">
          <MessageSquare className="h-4 w-4 shrink-0" />
          <div className="flex-1 overflow-hidden">
            <div className="truncate font-medium">
              {metadata?.title || chat.v0id}
            </div>
            {metadata?.description && (
              <div className="truncate text-xs text-muted-foreground">
                {metadata.description}
              </div>
            )}
          </div>
          <ExternalLink className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

// Server component that fetches chat data
async function ChatList({ userId, owned, token }: { userId: string; owned: boolean; token: string | null }) {
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
        <Suspense key={chat.id} fallback={<SidebarMenuSkeleton />}>
          <ChatItem chat={chat} token={owned ? token : null} />
        </Suspense>
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

  // Get user's v0 token for fetching private chat metadata
  const v0Token = await getDecryptedV0Token(user.clerkId)

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
              <ChatList userId={user.id} owned={true} token={v0Token} />
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
              <ChatList userId={user.id} owned={false} token={null} />
            </Suspense>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}