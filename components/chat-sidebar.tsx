import { Suspense } from 'react'
import { getCachedUser, chats, getDecryptedV0Token } from '@/db/queries'
import type { Chat } from '@/db/schema'
import { createClient } from 'v0-sdk'
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

// v0 Chat type based on the SDK
interface V0Chat {
  id: string
  name?: string
  privacy: 'public' | 'private' | 'team' | 'team-edit' | 'unlisted'
  createdAt: string
  webUrl: string
}

// Fetch v0 chat details
async function fetchV0ChatDetails(v0id: string, token: string | null): Promise<V0Chat | null> {
  if (!token) return null
  
  try {
    const client = createClient({ apiKey: token })
    const chatData = await client.chats.getById({ id: v0id })
    return chatData
  } catch (error) {
    console.error(`Failed to fetch v0 chat details for ${v0id}:`, error)
    return null
  }
}

// Fetch all user chats with v0 details in parallel
async function fetchAllChatsWithV0Details(userId: string, token: string | null): Promise<{
  privateChats: V0Chat[]
  publicChats: V0Chat[]
}> {
  // Get all user chats from our database
  const userChats = await chats.getUserChats(userId)
  
  // Fetch v0 details for all chats in parallel
  const v0Chats = await Promise.all(
    userChats.map(chat => fetchV0ChatDetails(chat.v0id, token))
  )
  
  // Filter out nulls
  const validChats = v0Chats.filter((chat): chat is V0Chat => chat !== null)
  
  // Split by privacy
  const privateChats = validChats.filter(chat => 
    chat.privacy === 'private' || chat.privacy === 'team' || chat.privacy === 'team-edit'
  )
  
  const publicChats = validChats.filter(chat => 
    chat.privacy === 'public' || chat.privacy === 'unlisted'
  )
  
  return { privateChats, publicChats }
}

// Chat item component
function ChatItem({ chat }: { chat: V0Chat }) {
  const displayName = chat.name || chat.id
  
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link href={`/chat/${chat.id}`} className="group">
          <MessageSquare className="h-4 w-4 shrink-0" />
          <div className="flex-1 overflow-hidden">
            <div className="truncate font-medium">
              {displayName}
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

// Server component that fetches and displays chats
async function ChatLists({ userId, token }: { userId: string; token: string | null }) {
  const { privateChats, publicChats } = await fetchAllChatsWithV0Details(userId, token)

  return (
    <>
      {/* Private Chats */}
      <SidebarGroup>
        <SidebarGroupLabel>
          <Lock className="mr-2 h-4 w-4" />
          Private Chats
          <span className="ml-auto text-xs text-muted-foreground">
            Your private sessions
          </span>
        </SidebarGroupLabel>
        <SidebarGroupContent>
          {privateChats.length === 0 ? (
            <div className="px-3 py-2 text-sm text-muted-foreground">
              No private chats yet
            </div>
          ) : (
            <SidebarMenu>
              {privateChats.map((chat) => (
                <ChatItem key={chat.id} chat={chat} />
              ))}
            </SidebarMenu>
          )}
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
          {publicChats.length === 0 ? (
            <div className="px-3 py-2 text-sm text-muted-foreground">
              No public chats yet
            </div>
          ) : (
            <SidebarMenu>
              {publicChats.map((chat) => (
                <ChatItem key={chat.id} chat={chat} />
              ))}
            </SidebarMenu>
          )}
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  )
}

// Loading skeleton component
function ChatListSkeleton() {
  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>
          <Lock className="mr-2 h-4 w-4" />
          Private Chats
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuSkeleton />
            <SidebarMenuSkeleton />
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      
      <SidebarSeparator />
      
      <SidebarGroup>
        <SidebarGroupLabel>
          <Globe className="mr-2 h-4 w-4" />
          Public Chats
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuSkeleton />
            <SidebarMenuSkeleton />
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  )
}

// Main sidebar component
export async function ChatSidebar() {
  const user = await getCachedUser()

  if (!user) {
    return null
  }

  // Get user's v0 token for fetching chat details
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
        <Suspense fallback={<ChatListSkeleton />}>
          <ChatLists userId={user.id} token={v0Token} />
        </Suspense>
      </SidebarContent>
    </Sidebar>
  )
}