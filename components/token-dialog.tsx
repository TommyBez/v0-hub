'use client'

import { Eye, EyeOff, Key, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { saveUserToken } from '@/app/actions'
import { Button } from '@/components/ui/button'
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from '@/components/responsive-dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { logger } from '@/lib/logger'

interface TokenDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onTokenSaved: () => void
}

export default function TokenDialog({
  open,
  onOpenChange,
  onTokenSaved,
}: TokenDialogProps) {
  const [tokenValue, setTokenValue] = useState('')
  const [showToken, setShowToken] = useState(false)
  const [isSavingToken, setIsSavingToken] = useState(false)

  const handleSaveToken = async () => {
    if (!tokenValue.trim()) {
      toast.error('Please enter a key')
      return
    }

    setIsSavingToken(true)
    try {
      await saveUserToken(tokenValue.trim())
      toast.success('Key saved successfully')
      setTokenValue('')
      setShowToken(false)
      onOpenChange(false)
      onTokenSaved()
    } catch (saveError) {
      toast.error('Failed to save key')
      logger.error(`Failed to save key: ${saveError}`)
    } finally {
      setIsSavingToken(false)
    }
  }

  return (
    <ResponsiveDialog
      onOpenChange={(isOpen) => {
        onOpenChange(isOpen)
        if (!isOpen) {
          setTokenValue('')
          setShowToken(false)
        }
      }}
      open={open}
    >
      <ResponsiveDialogContent>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Add v0 API Key</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Add your v0 API key to create private chats. Get your key from{' '}
            <a
              className="underline underline-offset-4 hover:text-primary"
              href="https://v0.dev/settings"
              rel="noopener noreferrer"
              target="_blank"
            >
              v0.dev settings
            </a>
            .
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>
        <div className="space-y-4 py-4 px-2 sm:px-0">
          <div className="space-y-2">
            <Label htmlFor="dialog-token">API Key</Label>
            <div className="flex gap-2">
              <Input
                disabled={isSavingToken}
                id="dialog-token"
                onChange={(e) => setTokenValue(e.target.value)}
                placeholder="Your v0 API key"
                type={showToken ? 'text' : 'password'}
                value={tokenValue}
              />
              <Button
                disabled={!tokenValue || isSavingToken}
                onClick={() => setShowToken(!showToken)}
                size="icon"
                type="button"
                variant="outline"
              >
                {showToken ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
        <ResponsiveDialogFooter>
          <Button
            disabled={isSavingToken}
            onClick={() => onOpenChange(false)}
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            disabled={isSavingToken || !tokenValue.trim()}
            onClick={handleSaveToken}
          >
            {isSavingToken ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Key className="mr-2 h-4 w-4" />
                Save Key
              </>
            )}
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
