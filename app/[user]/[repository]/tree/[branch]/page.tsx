"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { toast } from "sonner"
import { bootstrapChatFromRepo } from "@/app/actions"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, Copy, GitBranch } from "lucide-react"
import { SiGithub, SiV0 } from "@icons-pack/react-simple-icons"

interface ChatData {
  id: string
  url: string
  demo: string
  shortUrl?: string
  shortDemoUrl?: string
}

export default function DynamicBootstrapPage() {
  const params = useParams()
  const { user, repository, branch } = params as { user: string; repository: string; branch: string }

  const [isLoading, setIsLoading] = useState(true)
  const [chatData, setChatData] = useState<ChatData | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Construct the GitHub URL from params
  const repoUrl = `https://github.com/${user}/${repository}`

  useEffect(() => {
    const bootstrapChat = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Create FormData to match the expected format
        const formData = new FormData()
        formData.append("repoUrl", repoUrl)
        formData.append("branch", branch)

        // Call the server action
        const result = await bootstrapChatFromRepo(
          { success: false, message: "", data: null },
          formData
        )

        if (result.success && result.data) {
          setChatData(result.data)
          toast.success("Chat bootstrapped successfully!")
        } else {
          setError(result.message || "Failed to bootstrap chat")
          toast.error(result.message || "Failed to bootstrap chat")
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
        setError(errorMessage)
        toast.error(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    bootstrapChat()
  }, [repoUrl, branch])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard!")
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
                  Initializing v0 chat for {user}/{repository} on branch {branch}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Repository</Label>
              <div className="flex items-center gap-2">
                <Input readOnly value={repoUrl} className="flex-1" />
                <a href={repoUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="icon">
                    <SiGithub className="h-4 w-4" />
                    <span className="sr-only">Open GitHub repository</span>
                  </Button>
                </a>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Branch</Label>
              <div className="flex items-center gap-2">
                <GitBranch className="h-4 w-4" />
                <Input readOnly value={branch} className="flex-1" />
              </div>
            </div>

            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <span className="ml-3 text-muted-foreground">Bootstrapping chat...</span>
              </div>
            )}

            {error && (
              <div className="rounded-lg bg-destructive/10 p-4 text-destructive">
                <p className="text-sm font-medium">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {!isLoading && chatData && (
          <Card className="animate-in fade-in-50">
            <CardHeader>
              <CardTitle>Chat Created!</CardTitle>
              <CardDescription>Your new chat instance is ready. Open it and fork!</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Chat URL</Label>
                <div className="flex items-center gap-2">
                  <Input readOnly value={chatData.shortUrl || chatData.url} className="flex-1" />
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => copyToClipboard(chatData.shortUrl || chatData.url)}
                  >
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Copy URL</span>
                  </Button>
                  <a href={chatData.shortUrl || chatData.url} target="_blank" rel="noopener noreferrer">
                    <Button variant="default" size="icon">
                      <SiV0 className="h-4 w-4" />
                      <span className="sr-only">Open v0 chat</span>
                    </Button>
                  </a>
                </div>
              </div>

              {chatData.demo && (
                <div className="space-y-2">
                  <Label>Demo URL</Label>
                  <div className="flex items-center gap-2">
                    <Input readOnly value={chatData.shortDemoUrl || chatData.demo} className="flex-1" />
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => copyToClipboard(chatData.shortDemoUrl || chatData.demo)}
                    >
                      <Copy className="h-4 w-4" />
                      <span className="sr-only">Copy Demo URL</span>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}