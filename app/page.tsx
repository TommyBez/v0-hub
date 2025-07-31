"use client"

import { useActionState, useRef, useState, useEffect } from "react"
import { toast } from "sonner"
import { bootstrapChatFromRepo, fetchGitHubBranches } from "@/app/actions"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Github, Loader2, ExternalLink, Copy, GitBranch } from "lucide-react"

const initialState = {
  success: false,
  message: "",
  data: null as { id: string; url: string; demo: string } | null,
}

export default function BootstrapPage() {
  const [state, formAction, isPending] = useActionState(bootstrapChatFromRepo, initialState)
  const formRef = useRef<HTMLFormElement>(null)

  // Branch fetching state
  const [repoUrl, setRepoUrl] = useState("")
  const [branches, setBranches] = useState<string[]>([])
  const [selectedBranch, setSelectedBranch] = useState("")
  const [isFetchingBranches, setIsFetchingBranches] = useState(false)
  const [branchError, setBranchError] = useState("")

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
        // Auto-select main/master branch if available
        const defaultBranch =
          result.branches.find((branch) => branch === "main" || branch === "master") || result.branches[0]
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard!")
  }

  const handleSubmit = (formData: FormData) => {
    // Add the selected branch to form data
    formData.set("branch", selectedBranch)
    return formAction(formData)
  }

  // Show toast notifications for form submission results
  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast.success(state.message)
        formRef.current?.reset()
        setRepoUrl("")
        setBranches([])
        setSelectedBranch("")
      } else {
        toast.error(state.message)
      }
    }
  }, [state])

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
      <div className="w-full max-w-2xl space-y-8">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Github className="h-8 w-8" />
              <div>
                <CardTitle className="text-2xl">Bootstrap Chat from GitHub</CardTitle>
                <CardDescription>Initialize a new v0 chat instance from a public GitHub repository.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <form ref={formRef} action={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="repoUrl">GitHub Repository URL</Label>
                <Input
                  id="repoUrl"
                  name="repoUrl"
                  placeholder="https://github.com/vercel/next.js"
                  required
                  type="url"
                  disabled={isPending}
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
                    disabled={isPending || isFetchingBranches || branches.length === 0}
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
                          <div className="flex items-center gap-2">
                            <GitBranch className="h-4 w-4" />
                            {branch}
                          </div>
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
              <Button type="submit" className="w-full" disabled={isPending || !selectedBranch || isFetchingBranches}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Bootstrapping...
                  </>
                ) : (
                  "Bootstrap Chat"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {state.success && state.data && (
          <Card className="animate-in fade-in-50">
            <CardHeader>
              <CardTitle>Chat Created!</CardTitle>
              <CardDescription>Your new chat instance is ready. You can view it or embed it.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Chat URL</Label>
                <div className="flex items-center gap-2">
                  <Input readOnly value={state.data.url} className="flex-1" />
                  <Button variant="outline" size="icon" onClick={() => copyToClipboard(state.data.url)}>
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Copy URL</span>
                  </Button>
                  <a href={state.data.url} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="icon">
                      <ExternalLink className="h-4 w-4" />
                      <span className="sr-only">Open in new tab</span>
                    </Button>
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
