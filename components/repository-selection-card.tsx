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
  
  // Branch fetching state
  const [repoUrl, setRepoUrl] = useState("")
  const [branches, setBranches] = useState<string[]>([])
  const [selectedBranch, setSelectedBranch] = useState("")
  const [isFetchingBranches, setIsFetchingBranches] = useState(false)
  const [branchError, setBranchError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [extractedBranch, setExtractedBranch] = useState<string | null>(null)

  // Function to parse GitHub URL and extract branch if present
  const parseGitHubUrl = (url: string): { baseUrl: string; branch?: string } => {
    // Check if URL contains /tree/ pattern (indicating a branch)
    const treeIndex = url.indexOf('/tree/')
    
    if (treeIndex !== -1 && url.includes('github.com')) {
      // Extract base URL (everything before /tree/)
      const baseUrl = url.substring(0, treeIndex)
      
      // Extract branch name (everything after /tree/)
      const afterTree = url.substring(treeIndex + 6) // 6 is length of '/tree/'
      
      // The branch name is everything after /tree/
      // We'll let the branch validation handle whether it's valid
      const branch = afterTree || undefined
      
      return {
        baseUrl: baseUrl,
        branch: branch
      }
    }
    
    // Return original URL if no branch pattern found
    return { baseUrl: url }
  }

  // Handle URL input changes
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputUrl = e.target.value
    const { baseUrl, branch } = parseGitHubUrl(inputUrl)
    
    setRepoUrl(baseUrl)
    
    // Store extracted branch to use when branches are fetched
    if (branch) {
      setExtractedBranch(branch)
    } else {
      setExtractedBranch(null)
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
        
        // If we extracted a branch from the URL, try to match it with actual branches
        let defaultBranch: string
        if (extractedBranch) {
          // First, check if the extracted branch exactly matches a branch
          if (result.branches.includes(extractedBranch)) {
            defaultBranch = extractedBranch
          } else {
            // If not, check if any branch matches the beginning of the extracted string
            // This handles cases like "main/src/index.js" where "main" is the branch
            const matchingBranch = result.branches.find(branch => 
              extractedBranch.startsWith(branch + '/') || extractedBranch === branch
            )
            
            if (matchingBranch) {
              defaultBranch = matchingBranch
            } else {
              // Fall back to default branch selection
              defaultBranch =
                result.branches.find((branch) => branch === "main") ||
                result.branches.find((branch) => branch === "master") ||
                result.branches[0]
            }
          }
        } else {
          // No extracted branch, use default selection
          defaultBranch =
            result.branches.find((branch) => branch === "main") ||
            result.branches.find((branch) => branch === "master") ||
            result.branches[0]
        }
        
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
      // Extract owner and repo from URL
      const match = repoUrl.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+)(?:\.git)?(?:\/)?$/)
      if (match) {
        const [, owner, repo] = match
        router.push(`/${owner}/${repo}/tree/${selectedBranch}`)
      }
    } catch (error) {
      toast.error("An error occurred")
      setIsSubmitting(false)
    }
  }

  return (
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
              onChange={handleUrlChange}
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
        </CardContent>
        <CardFooter className="relative mt-6">
          <Button 
            type="submit" 
            className="w-full h-12 text-base font-semibold transition-all hover:scale-[1.02]" 
            size="lg"
            disabled={disabled || isSubmitting || !selectedBranch || isFetchingBranches}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Loading your v0 chat...
              </>
            ) : (
              <>
                Create v0 chat
                <span className="ml-2">→</span>
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}