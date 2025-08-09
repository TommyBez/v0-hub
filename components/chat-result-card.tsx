'use client'

import { SiV0 } from '@icons-pack/react-simple-icons'
import { Copy, Globe, Lock } from 'lucide-react'
import { use } from 'react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface ChatData {
  id: string
  url: string
  demo: string
}

interface ChatResultCardProps {
  chatResultPromise: Promise<{
    chatData: ChatData | null
    error: string | null
  }>
  isPrivate?: boolean
}

export default function ChatResultCard({
  chatResultPromise,
  isPrivate = false,
}: ChatResultCardProps) {
  const { chatData, error } = use(chatResultPromise)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  if (error) {
    return (
      <div className="rounded-lg bg-destructive/10 p-4 text-destructive">
        <p className="font-medium text-sm">Error</p>
        <p className="text-sm">{error}</p>
      </div>
    )
  }

  if (!chatData) {
    return null
  }

  return (
    <Card className="fade-in-50 animate-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Chat Created!</CardTitle>
            <CardDescription>
              Your new chat instance is ready. Open it and fork!.
            </CardDescription>
          </div>
          <Badge
            className="gap-1"
            variant={isPrivate ? 'default' : 'secondary'}
          >
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
            <Input className="flex-1" readOnly value={chatData.url} />
            <Button
              onClick={() => copyToClipboard(chatData.url)}
              size="icon"
              variant="outline"
            >
              <Copy className="h-4 w-4" />
              <span className="sr-only">Copy URL</span>
            </Button>
            <a href={chatData.url} rel="noopener noreferrer" target="_blank">
              <Button size="icon" variant="default">
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
