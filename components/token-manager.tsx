"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Key, Eye, EyeOff, Save, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
} from "@/components/ui/alert-dialog"
import { 
  getUserToken, 
  saveUserToken, 
  deleteUserToken
} from "@/app/actions"

interface TokenManagerProps {
  userId: string
}

export function TokenManager({ userId }: TokenManagerProps) {
  const [hasToken, setHasToken] = useState(false)
  const [tokenValue, setTokenValue] = useState("")
  const [showToken, setShowToken] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadTokenStatus()
  }, [])

  const loadTokenStatus = async () => {
    try {
      const { hasToken } = await getUserToken()
      setHasToken(hasToken)
    } catch (error) {
      toast.error("Failed to load token status")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveToken = async () => {
    if (!tokenValue.trim()) {
      toast.error("Please enter a token")
      return
    }

    setIsSaving(true)
    try {
      await saveUserToken(tokenValue.trim())
      toast.success("Token saved successfully")
      setTokenValue("")
      setHasToken(true)
      setShowToken(false)
    } catch (error) {
      toast.error("Failed to save token")
      console.error(error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteToken = async () => {
    try {
      await deleteUserToken()
      toast.success("Token deleted successfully")
      setHasToken(false)
      setTokenValue("")
    } catch (error) {
      toast.error("Failed to delete token")
      console.error(error)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-10">
          <div className="text-muted-foreground">Loading...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          v0 API Token
        </CardTitle>
        <CardDescription>
          {hasToken 
            ? "Your v0 API token is stored securely. You can update or remove it below."
            : "Add your v0 API token to create private chats. Get your token from "}
          {!hasToken && (
            <a 
              href="https://v0.dev/settings" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-primary"
            >
              v0.dev settings
            </a>
          )}
          {!hasToken && "."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="token">API Token</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                id="token"
                type={showToken ? "text" : "password"}
                placeholder={hasToken ? "Enter new token to update" : "Your v0 API token"}
                value={tokenValue}
                onChange={(e) => setTokenValue(e.target.value)}
                disabled={isSaving}
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowToken(!showToken)}
              disabled={!tokenValue}
            >
              {showToken ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
          {hasToken && (
            <p className="text-sm text-muted-foreground">
              Leave empty to keep your current token
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={handleSaveToken}
            disabled={isSaving || !tokenValue.trim()}
            className="flex-1"
          >
            <Save className="h-4 w-4 mr-2" />
            {hasToken ? "Update Token" : "Save Token"}
          </Button>
          
          {hasToken && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" disabled={isSaving}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Token</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete your v0 API token? You won&apos;t be able to create private chats without it.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteToken}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
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