"use client"

import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"
import { toast } from "sonner"

interface CopyButtonProps {
  text: string
}

export default function CopyButton({ text }: CopyButtonProps) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard!")
  }

  return (
    <Button 
      variant="outline" 
      size="icon" 
      onClick={copyToClipboard}
    >
      <Copy className="h-4 w-4" />
      <span className="sr-only">Copy URL</span>
    </Button>
  )
}