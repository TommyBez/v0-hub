import { createV0Chat, type ChatCreationResult } from "@/app/actions"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { GitBranch } from "lucide-react"
import { SiGithub } from "@icons-pack/react-simple-icons"
import Link from "next/link"
import ChatResultCard from "@/components/chat-result-card"

interface PageProps {
  params: {
    user: string
    repository: string
    branch: string
  }
}

export default async function DynamicBootstrapPage({ params }: PageProps) {
  const { user, repository, branch } = params

  // Construct the GitHub URL from params
  const repoUrl = `https://github.com/${user}/${repository}`

  let chatData: ChatCreationResult | null = null
  let error: string | null = null

  try {
    // Create the v0 chat
    chatData = await createV0Chat(repoUrl, branch)
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to bootstrap chat"
    console.error("Error bootstrapping chat:", err)
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
      <div className="w-full max-w-2xl space-y-8">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <SiGithub className="h-8 w-8" />
              <div>
                <CardTitle className="text-2xl">Bootstrap Chat from GitHub</CardTitle>
                <CardDescription>
                  {error 
                    ? `Failed to initialize v0 chat for ${user}/${repository}`
                    : `v0 chat initialized for ${user}/${repository} on branch ${branch}`
                  }
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Repository</Label>
              <div className="flex items-center gap-2">
                <Input readOnly value={repoUrl} className="flex-1" />
                <Link href={repoUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="icon">
                    <SiGithub className="h-4 w-4" />
                    <span className="sr-only">Open GitHub repository</span>
                  </Button>
                </Link>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Branch</Label>
              <div className="flex items-center gap-2">
                <GitBranch className="h-4 w-4" />
                <Input readOnly value={branch} className="flex-1" />
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-destructive/10 p-4 text-destructive">
                <p className="text-sm font-medium">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {chatData && <ChatResultCard chatData={chatData} />}
      </div>
    </div>
  )
}