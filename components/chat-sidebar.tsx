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

// Interface for v0 chat details
interface V0ChatInfo {
  id: string
  chatPrivacy?: 'public' | 'private'
  name?: string
  createdAt?: string
}

// Fetch v0 chat info to determine privacy
async function fetchV0ChatInfo(v0id: string, token: string | null): Promise<V0ChatInfo | null> {
  if (!token) return null
  
  try {
    const client = createClient({ apiKey: token })
    // Using the chats.find method to search for the specific chat
    const response = await client.chats.find({ limit: '100' })
    const chat = response.items?.find(item => item.id === v0id)
    
    if (chat) {
      return {
        id: chat.id,
        chatPrivacy: chat.chatPrivacy,
        name: chat.name,
        createdAt: chat.createdAt,
      }
    }
    return null
  } catch (error) {
    console.error(`Failed to fetch v0 chat info for ${v0id}:`, error)
    return null
  }
}

// Enhanced chat with v0 info
interface EnhancedChat extends Chat {
  v0Info?: V0ChatInfo | null
}

// Fetch all chats with their v0 info in parallel
async function fetchChatsWithV0Info(userId: string, token: string | null): Promise<{
  privateChats: EnhancedChat[]
  publicChats: EnhancedChat[]
}> {
  // Get all user chats
  const userChats = await chats.getUserChats(userId)
  
  // Fetch v0 info for all chats in parallel
  const chatsWithV0Info = await Promise.all(
    userChats.map(async (chat) => {
      const [fullChat, v0Info] = await Promise.all([
        chats.getById(chat.id),
        fetchV0ChatInfo(chat.v0id, token)
      ])
      
      return {
        ...fullChat!,
        v0Info
      } as EnhancedChat
    })
  )
  
  // Split into private and public based on v0 chatPrivacy
  const privateChats = chatsWithV0Info.filter(
    chat => chat.v0Info?.chatPrivacy === 'private'
  )
  const publicChats = chatsWithV0Info.filter(
    chat => chat.v0Info?.chatPrivacy === 'public' || !chat.v0Info
  )
  
  return { privateChats, publicChats }
}

// Chat item component
function ChatItem({ chat }: { chat: EnhancedChat }) {
  const displayName = chat.v0Info?.name || chat.v0id
  const createdDate = chat.v0Info?.createdAt 
    ? new Date(chat.v0Info.createdAt).toLocaleDateString()
    : new Date(chat.createdAt).toLocaleDateString()

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link href={`/chat/${chat.v0id}`} className="group">
          <MessageSquare className="h-4 w-4 shrink-0" />
          <div className="flex-1 overflow-hidden">
            <div className="truncate font-medium">
              {displayName}
            </div>
            <div className="truncate text-xs text-muted-foreground">
              {createdDate}
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
  const { privateChats, publicChats } = await fetchChatsWithV0Info(userId, token)

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