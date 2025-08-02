"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { fetchGitHubBranches } from "@/app/actions"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, GitBranch } from "lucide-react"
import { SiGithub } from "@icons-pack/react-simple-icons"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  repoUrl: z
    .string()
    .url({ message: "Please enter a valid URL" })
    .refine(
      (url) => url.match(/^https:\/\/github\.com\/[^/]+\/[^/]+(?:\.git)?(?:\/)?$/),
      { message: "Please enter a valid GitHub repository URL" }
    ),
  branch: z.string().min(1, { message: "Please select a branch" }),
})

type FormData = z.infer<typeof formSchema>

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
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      repoUrl: "",
      branch: "",
    },
  })

  const repoUrl = form.watch("repoUrl")
  const [branches, setBranches] = useState<string[]>([])
  const [isFetchingBranches, setIsFetchingBranches] = useState(false)
  const [branchError, setBranchError] = useState("")

  // Debounce repo URL changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (repoUrl && repoUrl.match(/^https:\/\/github\.com\/[^/]+\/[^/]+(?:\.git)?(?:\/)?$/)) {
        fetchBranches(repoUrl)
      } else {
        setBranches([])
        form.setValue("branch", "")
        setBranchError("")
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [repoUrl, form])

  const fetchBranches = async (url: string) => {
    setIsFetchingBranches(true)
    setBranchError("")
    setBranches([])
    form.setValue("branch", "")

    try {
      const result = await fetchGitHubBranches(url)

      if (result.success && result.branches) {
        setBranches(result.branches)
        // Prioritize "main" over "master", then fall back to first branch
        const defaultBranch =
          result.branches.find((branch) => branch === "main") ||
          result.branches.find((branch) => branch === "master") ||
          result.branches[0]
        
        if (defaultBranch) {
          form.setValue("branch", defaultBranch)
        }
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

  const onSubmit = async (data: FormData) => {
    try {
      // Extract owner and repo from URL
      const match = data.repoUrl.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+)(?:\.git)?(?:\/)?$/)
      if (match) {
        const [, owner, repo] = match
        router.push(`/${owner}/${repo}/tree/${data.branch}`)
      }
    } catch (error) {
      toast.error("An error occurred")
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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className={`relative space-y-4 ${!showHeader ? 'pt-6' : ''}`}>
            <FormField
              control={form.control}
              name="repoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">GitHub Repository URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://github.com/vercel/next.js"
                      type="url"
                      disabled={disabled || form.formState.isSubmitting}
                      className="h-12 text-base"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="branch"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">Branch</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={disabled || form.formState.isSubmitting || isFetchingBranches || branches.length === 0}
                  >
                    <FormControl>
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
                    </FormControl>
                    <SelectContent>
                      {branches.map((branch) => (
                        <SelectItem key={branch} value={branch}>
                          {branch}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {branchError && <FormMessage>{branchError}</FormMessage>}
                  {branches.length > 0 && (
                    <FormDescription>
                      Found {branches.length} branch{branches.length !== 1 ? "es" : ""}
                    </FormDescription>
                  )}
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="relative mt-6">
            <Button 
              type="submit" 
              className="w-full h-12 text-base font-semibold transition-all hover:scale-[1.02]" 
              size="lg"
              disabled={disabled || form.formState.isSubmitting || !form.watch("branch") || isFetchingBranches}
            >
              {form.formState.isSubmitting ? (
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
      </Form>
    </Card>
  )
}