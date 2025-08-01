import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { SiGithub } from "@icons-pack/react-simple-icons"

export default function Loading() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
      <div className="w-full max-w-2xl">
        <Card className="animate-in fade-in-50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <SiGithub className="h-8 w-8" />
              <div>
                <CardTitle className="text-2xl">Bootstrapping Chat</CardTitle>
                <CardDescription>Creating your v0 chat instance from GitHub repository...</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-3 text-muted-foreground">Initializing chat...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}