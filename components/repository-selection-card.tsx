"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { fetchGitHubBranches, getTokens, type V0Token } from "@/app/actions"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, GitBranch, Lock, Globe, Key } from "lucide-react"
import { SiGithub } from "@icons-pack/react-simple-icons"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@clerk/nextjs"
import Link from "next/link"
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
  
  // Branch fetching state
  const [repoUrl, setRepoUrl] = useState("")
  const [branches, setBranches] = useState<string[]>([])
  const [selectedBranch, setSelectedBranch] = useState("")
  const [isFetchingBranches, setIsFetchingBranches] = useState(false)
  const [branchError, setBranchError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Private chat state
  const [isPrivateChat, setIsPrivateChat] = useState(false)
  const [tokens, setTokens] = useState<V0Token[]>([])
  const [selectedTokenId, setSelectedTokenId] = useState<string>("")
  const [loadingTokens, setLoadingTokens] = useState(false)
  const [showAuthDialog, setShowAuthDialog] = useState(false)

  // Load tokens when private chat is enabled and user is signed in
  useEffect(() => {
    if (isPrivateChat && isSignedIn) {
      loadTokens()
    }
  }, [isPrivateChat, isSignedIn])

  const loadTokens = async () => {
    setLoadingTokens(true)
    try {
      const userTokens = await getTokens()
      setTokens(userTokens)
      if (userTokens.length > 0) {
        setSelectedTokenId(userTokens[0].id)
      }
    } catch (error) {
      console.error("Failed to load tokens:", error)
      toast.error("Failed to load your tokens")
    } finally {
      setLoadingTokens(false)
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
      setShowAuthDialog(true)
      return
    }
    setIsPrivateChat(checked)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!repoUrl || !selectedBranch) return
    
    if (isPrivateChat && !selectedTokenId) {
      toast.error("Please select a token for private chat")
      return
    }

    setIsSubmitting(true)

    try {
      // Extract owner and repo from URL
      const match = repoUrl.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+)(?:\.git)?(?:\/)?$/)
      if (match) {
        const [, owner, repo] = match
        const params = new URLSearchParams()
        if (isPrivateChat && selectedTokenId) {
          params.set("token", selectedTokenId)
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

              {isPrivateChat && isSignedIn && (
                <div className="space-y-2">
                  <Label htmlFor="token" className="text-base font-medium">Select Token</Label>
                  {loadingTokens ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                  ) : tokens.length === 0 ? (
                    <div className="text-center py-4 space-y-2">
                      <p className="text-sm text-muted-foreground">No tokens found</p>
                      <Link href="/tokens">
                        <Button variant="outline" size="sm">
                          <Key className="h-4 w-4 mr-2" />
                          Add Token
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <Select
                      value={selectedTokenId}
                      onValueChange={setSelectedTokenId}
                      disabled={disabled || isSubmitting}
                    >
                      <SelectTrigger className="w-full h-12 text-base">
                        <SelectValue placeholder="Select a token" />
                      </SelectTrigger>
                      <SelectContent>
                        {tokens.map((token) => (
                          <SelectItem key={token.id} value={token.id}>
                            <div className="flex items-center gap-2">
                              <Key className="h-4 w-4" />
                              {token.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              )}
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
                isFetchingBranches ||
                (isPrivateChat && (!selectedTokenId || tokens.length === 0))
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

      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign In Required</DialogTitle>
            <DialogDescription>
              You need to sign in to create private chats with your own v0 tokens.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAuthDialog(false)}>
              Cancel
            </Button>
            <Link href="/sign-in">
              <Button>Sign In</Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}