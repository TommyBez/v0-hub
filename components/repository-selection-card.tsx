"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { fetchGitHubBranches, getUserToken, saveUserToken } from "@/app/actions"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, GitBranch, Lock, Globe, Key, Eye, EyeOff } from "lucide-react"
import { SiGithub } from "@icons-pack/react-simple-icons"
import { Switch } from "@/components/ui/switch"
import { useAuth, useClerk } from "@clerk/nextjs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface RepositorySelectionCardProps {
  title?: string
  description?: string
  disabled?: boolean
  showHeader?: boolean
}

export default function RepositorySelectionCard({
  title = "Bootstrap Chat from GitHub",
  description = "Initialize a new v0 chat instance from a public GitHub repository.",
  disabled = false,
  showHeader = true,
}: RepositorySelectionCardProps) {
  const router = useRouter()
  const { isSignedIn } = useAuth()
  const { openSignIn } = useClerk()
  
  // Branch fetching state
  const [repoUrl, setRepoUrl] = useState("")
  const [branches, setBranches] = useState<string[]>([])
  const [selectedBranch, setSelectedBranch] = useState("")
  const [isFetchingBranches, setIsFetchingBranches] = useState(false)
  const [branchError, setBranchError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Private chat state
  const [isPrivateChat, setIsPrivateChat] = useState(false)
  const [hasToken, setHasToken] = useState(false)
  const [showTokenDialog, setShowTokenDialog] = useState(false)
  
  // Token form state
  const [tokenValue, setTokenValue] = useState("")
  const [showToken, setShowToken] = useState(false)
  const [isSavingToken, setIsSavingToken] = useState(false)

  // Check if user has token when private chat is enabled
  useEffect(() => {
    if (isPrivateChat && isSignedIn) {
      checkUserToken()
    }
  }, [isPrivateChat, isSignedIn])

  const checkUserToken = async () => {
    try {
      const { hasToken } = await getUserToken()
      setHasToken(hasToken)
      if (!hasToken) {
        setShowTokenDialog(true)
        setIsPrivateChat(false)
      }
    } catch (error) {
      console.error("Failed to check token:", error)
    }
  }

  // Debounce repo URL changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (repoUrl && repoUrl.match(/^https:\/\/github\.com\/[^/]+\/[^/]+(?:\.git)?(?:\/)?$/)) {
        fetchBranches(repoUrl)
      } else {
        setBranches([])
        setSelectedBranch("")
        setBranchError("")
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [repoUrl])

  const fetchBranches = async (url: string) => {
    setIsFetchingBranches(true)
    setBranchError("")
    setBranches([])
    setSelectedBranch("")

    try {
      const result = await fetchGitHubBranches(url)

      if (result.success && result.branches) {
        setBranches(result.branches)
        // Prioritize "main" over "master", then fall back to first branch
        const defaultBranch =
          result.branches.find((branch) => branch === "main") ||
          result.branches.find((branch) => branch === "master") ||
          result.branches[0]
        setSelectedBranch(defaultBranch)
        toast.success(`Found ${result.branches.length} branches`)
      } else {
        setBranchError(result.error || "Failed to fetch branches")
        toast.error(result.error || "Failed to fetch branches")
      }
    } catch (error) {
      setBranchError("Failed to fetch branches")
      toast.error("Failed to fetch branches")
    } finally {
      setIsFetchingBranches(false)
    }
  }

  const handlePrivateChatToggle = (checked: boolean) => {
    if (checked && !isSignedIn) {
      openSignIn()
      return
    }
    setIsPrivateChat(checked)
  }

  const handleSaveToken = async () => {
    if (!tokenValue.trim()) {
      toast.error("Please enter a token")
      return
    }

    setIsSavingToken(true)
    try {
      await saveUserToken(tokenValue.trim())
      toast.success("Token saved successfully")
      setTokenValue("")
      setShowToken(false)
      setShowTokenDialog(false)
      setHasToken(true)
      setIsPrivateChat(true) // Enable private chat after saving token
    } catch (error) {
      toast.error("Failed to save token")
      console.error(error)
    } finally {
      setIsSavingToken(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!repoUrl || !selectedBranch) return

    setIsSubmitting(true)

    try {
      // Extract owner and repo from URL
      const match = repoUrl.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+)(?:\.git)?(?:\/)?$/)
      if (match) {
        const [, owner, repo] = match
        const params = new URLSearchParams()
        if (isPrivateChat) {
          params.set("private", "true")
        }
        const queryString = params.toString()
        const url = `/${owner}/${repo}/tree/${selectedBranch}${queryString ? `?${queryString}` : ""}`
        router.push(url)
      }
    } catch (error) {
      toast.error("An error occurred")
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Card className="relative overflow-hidden border-primary/20 shadow-xl shadow-primary/5">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
        {showHeader && (
          <CardHeader className="relative">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10 backdrop-blur-sm">
                <SiGithub className="h-8 w-8 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </div>
            </div>
          </CardHeader>
        )}
        <form onSubmit={handleSubmit}>
          <CardContent className={`relative space-y-4 ${!showHeader ? 'pt-6' : ''}`}>
            <div className="space-y-2">
              <Label htmlFor="repoUrl" className="text-base font-medium">GitHub Repository URL</Label>
              <Input
                id="repoUrl"
                name="repoUrl"
                placeholder="https://github.com/vercel/next.js"
                required
                type="url"
                disabled={disabled || isSubmitting}
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                className="h-12 text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="branch" className="text-base font-medium">Branch</Label>
              <div className="relative">
                <Select
                  value={selectedBranch}
                  onValueChange={setSelectedBranch}
                  disabled={disabled || isSubmitting || isFetchingBranches || branches.length === 0}
                >
                  <SelectTrigger className="w-full h-12 text-base">
                    <div className="flex items-center gap-2">
                      {isFetchingBranches ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <GitBranch className="h-4 w-4" />
                      )}
                      <SelectValue
                        placeholder={
                          isFetchingBranches
                            ? "Fetching branches..."
                            : branches.length === 0
                              ? "Enter repository URL first"
                              : "Select a branch"
                        }
                      />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((branch) => (
                      <SelectItem key={branch} value={branch}>
                        {branch}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {branchError && <p className="text-sm text-destructive">{branchError}</p>}
              {branches.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  Found {branches.length} branch{branches.length !== 1 ? "es" : ""}
                </p>
              )}
            </div>

            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="private-chat" className="text-base font-medium flex items-center gap-2">
                    {isPrivateChat ? (
                      <Lock className="h-4 w-4" />
                    ) : (
                      <Globe className="h-4 w-4" />
                    )}
                    {isPrivateChat ? "Private Chat" : "Public Chat"}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {isPrivateChat ? "Uses your personal v0 token" : "Uses the default v0 token"}
                  </p>
                </div>
                <Switch
                  id="private-chat"
                  checked={isPrivateChat}
                  onCheckedChange={handlePrivateChatToggle}
                  disabled={disabled || isSubmitting}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="relative mt-6">
            <Button 
              type="submit" 
              className="w-full h-12 text-base font-semibold transition-all hover:scale-[1.02]" 
              size="lg"
              disabled={
                disabled || 
                isSubmitting || 
                !selectedBranch || 
                isFetchingBranches
              }
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Loading your v0 chat...
                </>
              ) : (
                <>
                  {isPrivateChat ? <Lock className="mr-2 h-5 w-5" /> : null}
                  Create {isPrivateChat ? "private" : "v0"} chat
                  <span className="ml-2">→</span>
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Dialog open={showTokenDialog} onOpenChange={(open) => {
        setShowTokenDialog(open)
        if (!open) {
          setTokenValue("")
          setShowToken(false)
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add v0 API Token</DialogTitle>
            <DialogDescription>
              Add your v0 API token to create private chats. Get your token from{" "}
              <a 
                href="https://v0.dev/settings" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:text-primary"
              >
                v0.dev settings
              </a>
              .
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="dialog-token">API Token</Label>
              <div className="flex gap-2">
                <Input
                  id="dialog-token"
                  type={showToken ? "text" : "password"}
                  placeholder="Your v0 API token"
                  value={tokenValue}
                  onChange={(e) => setTokenValue(e.target.value)}
                  disabled={isSavingToken}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setShowToken(!showToken)}
                  disabled={!tokenValue || isSavingToken}
                >
                  {showToken ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowTokenDialog(false)}
              disabled={isSavingToken}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveToken}
              disabled={isSavingToken || !tokenValue.trim()}
            >
              {isSavingToken ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Key className="h-4 w-4 mr-2" />
                  Save Token
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}