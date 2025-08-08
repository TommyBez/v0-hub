"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Copy, Lock, Globe } from "lucide-react"
import { SiV0 } from "@icons-pack/react-simple-icons"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"

interface ChatData {
  id: string
  url: string
  demo: string
  shortUrl?: string
  shortDemoUrl?: string
}

interface ChatResultCardProps {
  chatData: ChatData
  isPrivate?: boolean
}

export default function ChatResultCard({ chatData, isPrivate = false }: ChatResultCardProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard!")
  }

  return (
    <Card className="animate-in fade-in-50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Chat Created!</CardTitle>
            <CardDescription>Your new chat instance is ready. Open it and fork!.</CardDescription>
          </div>
          <Badge variant={isPrivate ? "default" : "secondary"} className="gap-1">
            {isPrivate ? (
              <>
                <Lock className="h-3 w-3" />
                Private
              </>
            ) : (
              <>
                <Globe className="h-3 w-3" />
                Public
              </>
            )}
          </Badge>
        </div>
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
      </CardContent>
    </Card>
  )
}