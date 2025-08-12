import { ExternalLink, Globe, Lock, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'
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
import { getCachedUser, getDecryptedV0Token, getUserChats } from '@/db/queries'
import { logger } from '@/lib/logger'

// v0 Chat type based on the SDK response
type V0Chat = Awaited<
  ReturnType<ReturnType<typeof createClient>['chats']['getById']>
>

// Fetch all user chats with v0 details in parallel
async function fetchAllChatsWithV0Details(
  userId: string,
  token: string | null,
): Promise<{
  privateChats: V0Chat[]
  publicChats: V0Chat[]
}> {
  // Get all user chats from our database
  const userChats = await getUserChats(userId)

  // Create at most two clients
  const userClient = token ? createClient({ apiKey: token }) : null
  const serverClient = process.env.V0_API_KEY
    ? createClient({ apiKey: process.env.V0_API_KEY })
    : null

  // If both clients are missing, we can't fetch any chats
  const hasClients = userClient || serverClient
  if (!hasClients) {
    logger.error('No API keys available to fetch v0 chat details')
    return { privateChats: [], publicChats: [] }
  }

  // Fetch v0 details for all chats in parallel
  const v0Chats = await Promise.all(
    userChats.map(async (chat) => {
      try {
        // Determine which client to use based on ownership
        let client: ReturnType<typeof createClient> | null = null

        if (chat.owned) {
          // For owned chats, must use user client
          client = userClient
        } else {
          // For non-owned chats, prefer server client, fall back to user client
          client = serverClient || userClient
        }

        if (!client) {
          logger.error(
            `No client available to fetch v0 chat details for ${chat.v0id}`,
          )
          return null
        }

        const chatData = await client.chats.getById({ chatId: chat.v0id })
        return chatData
      } catch (error) {
        logger.error(
          `Failed to fetch v0 chat details for ${chat.v0id}: ${error}`,
        )
        return null
      }
    }),
  )

  // Filter out nulls
  const validChats = v0Chats.filter((chat) => chat !== null)

  // Split by privacy
  const privateChats = validChats.filter(
    (chat) =>
      chat.privacy === 'private' ||
      chat.privacy === 'team' ||
      chat.privacy === 'team-edit',
  )

  const publicChats = validChats.filter(
    (chat) => chat.privacy === 'public' || chat.privacy === 'unlisted',
  )

  return { privateChats, publicChats }
}

// Chat item component
function ChatItem({ chat }: { chat: V0Chat }) {
  const displayName = chat.name || chat.id

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link className="group" href={`/chat/${chat.id}`}>
          <MessageSquare className="h-4 w-4 shrink-0" />
          <div className="flex-1 overflow-hidden">
            <div className="truncate font-medium">{displayName}</div>
            <div className="truncate text-muted-foreground text-xs">
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
async function ChatLists({
  userId,
  token,
}: {
  userId: string
  token: string | null
}) {
  const { privateChats, publicChats } = await fetchAllChatsWithV0Details(
    userId,
    token,
  )

  return (
    <>
      {/* Private Chats */}
      <SidebarGroup>
        <SidebarGroupLabel>
          <Lock className="mr-2 h-4 w-4" />
          Private Chats
        </SidebarGroupLabel>
        <SidebarGroupContent>
          {privateChats.length === 0 ? (
            <div className="px-3 py-2 text-muted-foreground text-sm">
              No private chats yet
            </div>
          ) : (
            <SidebarMenu>
              {privateChats.map((chat) => (
                <ChatItem chat={chat} key={chat.id} />
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
        </SidebarGroupLabel>
        <SidebarGroupContent>
          {publicChats.length === 0 ? (
            <div className="px-3 py-2 text-muted-foreground text-sm">
              No public chats yet
            </div>
          ) : (
            <SidebarMenu>
              {publicChats.map((chat) => (
                <ChatItem chat={chat} key={chat.id} />
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
          <h2 className="font-semibold text-lg">Your Chats</h2>
          <p className="text-muted-foreground text-xs">
            Manage your v0 chat sessions
          </p>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <Suspense fallback={<ChatListSkeleton />}>
          <ChatLists token={v0Token} userId={user.id} />
        </Suspense>
      </SidebarContent>
    </Sidebar>
  )
}
