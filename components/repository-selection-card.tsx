"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { fetchGitHubBranches } from "@/app/actions"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, GitBranch } from "lucide-react"
import { SiGithub } from "@icons-pack/react-simple-icons"

interface RepositorySelectionCardProps {
  title?: string
  description?: string
  buttonText?: string
  onSubmit?: (repoUrl: string, branch: string) => void | Promise<void>
  navigateOnSubmit?: boolean
  disabled?: boolean
}

export default function RepositorySelectionCard({
  title = "Bootstrap Chat from GitHub",
  description = "Initialize a new v0 chat instance from a public GitHub repository.",
  buttonText = "Bootstrap Chat",
  onSubmit,
  navigateOnSubmit = false,
  disabled = false,
}: RepositorySelectionCardProps) {
  const router = useRouter()
  
  // Branch fetching state
  const [repoUrl, setRepoUrl] = useState("")
  const [branches, setBranches] = useState<string[]>([])
  const [selectedBranch, setSelectedBranch] = useState("")
  const [isFetchingBranches, setIsFetchingBranches] = useState(false)
  const [branchError, setBranchError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!repoUrl || !selectedBranch) return

    setIsSubmitting(true)

    try {
      if (navigateOnSubmit) {
        // Extract owner and repo from URL
        const match = repoUrl.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+)(?:\.git)?(?:\/)?$/)
        if (match) {
          const [, owner, repo] = match
          router.push(`/${owner}/${repo}/tree/${selectedBranch}`)
        }
      } else if (onSubmit) {
        await onSubmit(repoUrl, selectedBranch)
      }
    } catch (error) {
      toast.error("An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <SiGithub className="h-8 w-8" />
          <div>
            <CardTitle className="text-2xl">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="repoUrl">GitHub Repository URL</Label>
            <Input
              id="repoUrl"
              name="repoUrl"
              placeholder="https://github.com/vercel/next.js"
              required
              type="url"
              disabled={disabled || isSubmitting}
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="branch">Branch</Label>
            <div className="relative">
              <Select
                value={selectedBranch}
                onValueChange={setSelectedBranch}
                disabled={disabled || isSubmitting || isFetchingBranches || branches.length === 0}
              >
                <SelectTrigger className="w-full">
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
        </CardContent>
        <CardFooter className="mt-6">
          <Button 
            type="submit" 
            className="w-full" 
            disabled={disabled || isSubmitting || !selectedBranch || isFetchingBranches}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              buttonText
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}