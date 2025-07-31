"use client"

import { useActionState, useRef } from "react"
import { toast } from "sonner"
import { bootstrapChatFromRepo } from "@/app/actions"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Github, Loader2, ExternalLink, Copy } from "lucide-react"

const initialState = {
  success: false,
  message: "",
  data: null as { id: string; url: string; demo: string } | null,
}

export default function BootstrapPage() {
  const [state, formAction, isPending] = useActionState(bootstrapChatFromRepo, initialState)
  const formRef = useRef<HTMLFormElement>(null)

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
              <Github className="h-8 w-8" />
              <div>
                <CardTitle className="text-2xl">Bootstrap Chat from GitHub</CardTitle>
                <CardDescription>Initialize a new v0 chat instance from a public GitHub repository.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <form ref={formRef} action={formAction}>
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
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="branch">Branch</Label>
                <Input id="branch" name="branch" placeholder="canary" required disabled={isPending} />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isPending}>
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
              <div className="space-y-2">
                <Label>Preview (Embeddable)</Label>
                <div className="aspect-video w-full overflow-hidden rounded-lg border">
                  <iframe
                    src={state.data.demo}
                    width="100%"
                    height="100%"
                    className="border-0"
                    title={`v0 Chat Preview - ${state.data.id}`}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
