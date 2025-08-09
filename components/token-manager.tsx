'use client'

import { Eye, EyeOff, Key, Save, Trash2 } from 'lucide-react'
import { use, useState } from 'react'
import { toast } from 'sonner'
import { deleteUserToken, saveUserToken } from '@/app/actions'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
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
import { logger } from '@/lib/logger'

export function TokenManager({
  tokenStatusPromise,
}: {
  tokenStatusPromise: Promise<{ hasToken: boolean }>
}) {
  const { hasToken: initialHasToken } = use(tokenStatusPromise)
  const [hasToken, setHasToken] = useState(initialHasToken)
  const [tokenValue, setTokenValue] = useState('')
  const [showToken, setShowToken] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleSaveToken = async () => {
    if (!tokenValue.trim()) {
      toast.error('Please enter a key')
      return
    }

    setIsSaving(true)
    try {
      await saveUserToken(tokenValue.trim())
      toast.success('Key saved successfully')
      setTokenValue('')
      setHasToken(true)
      setShowToken(false)
    } catch (error) {
      toast.error('Failed to save key')
      logger.error(`Failed to save key: ${error}`)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteToken = async () => {
    try {
      await deleteUserToken()
      toast.success('Key deleted successfully')
      setHasToken(false)
      setTokenValue('')
    } catch (error) {
      toast.error('Failed to delete key')
      logger.error(`Failed to delete key: ${error}`)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          v0 API Key
        </CardTitle>
        <CardDescription>
          {hasToken
            ? 'Your v0 API key is stored securely. You can update or remove it below.'
            : 'Add your v0 API key to create private chats. Get your key from '}
          {!hasToken && (
            <a
              className="underline underline-offset-4 hover:text-primary"
              href="https://v0.dev/settings"
              rel="noopener noreferrer"
              target="_blank"
            >
              v0.dev settings
            </a>
          )}
          {!hasToken && '.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="token">API Key</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                disabled={isSaving}
                id="token"
                onChange={(e) => setTokenValue(e.target.value)}
                placeholder={
                  hasToken ? 'Enter new key to update' : 'Your v0 API key'
                }
                type={showToken ? 'text' : 'password'}
                value={tokenValue}
              />
            </div>
            <Button
              disabled={!tokenValue}
              onClick={() => setShowToken(!showToken)}
              size="icon"
              variant="outline"
            >
              {showToken ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
          {hasToken && (
            <p className="text-muted-foreground text-sm">
              Leave empty to keep your current key
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            className="flex-1"
            disabled={isSaving || !tokenValue.trim()}
            onClick={handleSaveToken}
          >
            <Save className="mr-2 h-4 w-4" />
            {hasToken ? 'Update Key' : 'Save Key'}
          </Button>

          {hasToken && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button disabled={isSaving} variant="outline">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Key</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete your v0 API key? You
                    won&apos;t be able to create private chats without it.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={handleDeleteToken}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
