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

// Fetch all user chats with full details in parallel
async function fetchAllChatsWithDetails(userId: string): Promise<{
  privateChats: Chat[]
  publicChats: Chat[]
}> {
  // Get all user chats
  const userChats = await chats.getUserChats(userId)
  
  // Fetch full details for all chats in parallel
  const fullChats = await Promise.all(
    userChats.map(chat => chats.getById(chat.id))
  )
  
  // Filter out any null results and split by privacy
  const validChats = fullChats.filter((chat): chat is Chat => chat !== null)
  
  // TODO: Update this logic based on how privacy is stored in the chat data
  // For now, assuming there's a field that indicates privacy status
  // This needs to be adjusted based on actual chat schema
  const privateChats = validChats.filter(chat => {
    // Placeholder: adjust based on actual privacy field
    return false // Update this based on actual chat data structure
  })
  
  const publicChats = validChats.filter(chat => {
    // Placeholder: adjust based on actual privacy field
    return true // Update this based on actual chat data structure
  })
  
  return { privateChats, publicChats }
}

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

// Server component that fetches and displays chats
async function ChatLists({ userId }: { userId: string }) {
  const { privateChats, publicChats } = await fetchAllChatsWithDetails(userId)

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
          <ChatLists userId={user.id} />
        </Suspense>
      </SidebarContent>
    </Sidebar>
  )
}