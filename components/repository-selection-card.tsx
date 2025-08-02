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

// Helper function to parse GitHub URLs and extract branch information
function parseGitHubUrl(url: string): { cleanUrl: string; extractedBranch?: string } {
  // Check if URL includes branch information (tree/branch-name)
  const branchMatch = url.match(/^(https:\/\/github\.com\/[^/]+\/[^/]+)\/tree\/([^/]+)(?:\/.*)?$/)
  
  if (branchMatch) {
    const [, baseUrl, branchName] = branchMatch
    return {
      cleanUrl: baseUrl,
      extractedBranch: branchName
    }
  }
  
  // Regular GitHub URL without branch - just clean it up
  const cleanMatch = url.match(/^(https:\/\/github\.com\/[^/]+\/[^/]+)(?:\.git)?(?:\/)?$/)
  if (cleanMatch) {
    return {
      cleanUrl: cleanMatch[1]
    }
  }
  
  // Return as-is if it doesn't match expected patterns
  return { cleanUrl: url }
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
  const [extractedBranch, setExtractedBranch] = useState<string | undefined>(undefined)

  // Handle repo URL input changes with branch extraction
  const handleRepoUrlChange = (value: string) => {
    const { cleanUrl, extractedBranch } = parseGitHubUrl(value)
    
    setRepoUrl(cleanUrl)
    setExtractedBranch(extractedBranch)
    
    // If we extracted a branch, show a helpful message
    if (extractedBranch && extractedBranch !== selectedBranch) {
      toast.info(`Detected branch "${extractedBranch}" in URL`)
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
        setExtractedBranch(undefined)
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
        
        // Determine default branch priority:
        // 1. Extracted branch from URL (if it exists in the repository)
        // 2. "main" branch
        // 3. "master" branch  
        // 4. First branch in the list
        let defaultBranch: string
        
        if (extractedBranch && result.branches.includes(extractedBranch)) {
          defaultBranch = extractedBranch
          toast.success(`Using branch "${extractedBranch}" from URL`)
        } else {
          defaultBranch =
            result.branches.find((branch) => branch === "main") ||
            result.branches.find((branch) => branch === "master") ||
            result.branches[0]
          
          if (extractedBranch && !result.branches.includes(extractedBranch)) {
            toast.warning(`Branch "${extractedBranch}" not found. Using "${defaultBranch}" instead.`)
          } else {
            toast.success(`Found ${result.branches.length} branches`)
          }
        }
        
        setSelectedBranch(defaultBranch)
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
              onChange={(e) => handleRepoUrlChange(e.target.value)}
              className="h-12 text-base"
            />
            {extractedBranch && (
              <p className="text-sm text-muted-foreground">
                Detected branch: <span className="font-medium text-primary">{extractedBranch}</span>
              </p>
            )}
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