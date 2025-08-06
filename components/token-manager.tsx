"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Plus, Trash2, Edit2, Eye, EyeOff, Key, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { 
  getTokens, 
  addToken, 
  updateToken, 
  deleteToken,
  type V0Token 
} from "@/app/actions"

interface TokenManagerProps {
  userId: string
}

export function TokenManager({ userId }: TokenManagerProps) {
  const [tokens, setTokens] = useState<V0Token[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingToken, setEditingToken] = useState<V0Token | null>(null)
  const [showTokenId, setShowTokenId] = useState<string | null>(null)
  
  // Form states
  const [tokenName, setTokenName] = useState("")
  const [tokenValue, setTokenValue] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    loadTokens()
  }, [])

  const loadTokens = async () => {
    try {
      const userTokens = await getTokens()
      setTokens(userTokens)
    } catch (error) {
      toast.error("Failed to load tokens")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToken = async () => {
    if (!tokenName.trim() || !tokenValue.trim()) {
      toast.error("Please fill in all fields")
      return
    }

    setIsSubmitting(true)
    try {
      await addToken(tokenName.trim(), tokenValue.trim())
      toast.success("Token added successfully")
      setTokenName("")
      setTokenValue("")
      setIsAddDialogOpen(false)
      await loadTokens()
    } catch (error) {
      toast.error("Failed to add token")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateToken = async () => {
    if (!editingToken || !tokenName.trim()) {
      toast.error("Please provide a token name")
      return
    }

    setIsSubmitting(true)
    try {
      await updateToken(editingToken.id, {
        name: tokenName.trim(),
        token: tokenValue.trim() || undefined,
      })
      toast.success("Token updated successfully")
      setEditingToken(null)
      setTokenName("")
      setTokenValue("")
      await loadTokens()
    } catch (error) {
      toast.error("Failed to update token")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteToken = async (tokenId: string) => {
    try {
      await deleteToken(tokenId)
      toast.success("Token deleted successfully")
      await loadTokens()
    } catch (error) {
      toast.error("Failed to delete token")
      console.error(error)
    }
  }

  const maskToken = (token: string) => {
    if (token.length <= 8) return "••••••••"
    return `${token.substring(0, 4)}••••${token.substring(token.length - 4)}`
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-10">
          <div className="text-muted-foreground">Loading tokens...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Add Token Button */}
      <div className="flex justify-end">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Token
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add v0 API Token</DialogTitle>
              <DialogDescription>
                Add a new v0 API token to create private chats. You can get your token from{" "}
                <a 
                  href="https://v0.dev/settings" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  v0.dev settings
                </a>
                .
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="token-name">Token Name</Label>
                <Input
                  id="token-name"
                  placeholder="e.g., Personal Token"
                  value={tokenName}
                  onChange={(e) => setTokenName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="token-value">API Token</Label>
                <Input
                  id="token-value"
                  type="password"
                  placeholder="Your v0 API token"
                  value={tokenValue}
                  onChange={(e) => setTokenValue(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddDialogOpen(false)
                  setTokenName("")
                  setTokenValue("")
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button onClick={handleAddToken} disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Token"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tokens List */}
      {tokens.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10 text-center">
            <Key className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No tokens yet</h3>
            <p className="text-muted-foreground mb-4">
              Add your first v0 API token to start creating private chats.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {tokens.map((token) => (
            <Card key={token.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">{token.name}</CardTitle>
                    <CardDescription className="text-sm">
                      Added {formatDistanceToNow(new Date(token.createdAt), { addSuffix: true })}
                      {token.lastUsedAt && (
                        <span>
                          {" • "}Last used {formatDistanceToNow(new Date(token.lastUsedAt), { addSuffix: true })}
                        </span>
                      )}
                    </CardDescription>
                  </div>
                  <Badge variant={token.isActive ? "default" : "secondary"}>
                    {token.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 font-mono text-sm">
                  <span className="text-muted-foreground">Token:</span>
                  <code className="flex-1">{maskToken("••••••••••••••••")}</code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowTokenId(showTokenId === token.id ? null : token.id)}
                  >
                    {showTokenId === token.id ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Dialog 
                  open={editingToken?.id === token.id} 
                  onOpenChange={(open) => {
                    if (!open) {
                      setEditingToken(null)
                      setTokenName("")
                      setTokenValue("")
                    }
                  }}
                >
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setEditingToken(token)
                        setTokenName(token.name)
                        setTokenValue("")
                      }}
                    >
                      <Edit2 className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Token</DialogTitle>
                      <DialogDescription>
                        Update the token name or replace the token value.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-token-name">Token Name</Label>
                        <Input
                          id="edit-token-name"
                          value={tokenName}
                          onChange={(e) => setTokenName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-token-value">New API Token (optional)</Label>
                        <Input
                          id="edit-token-value"
                          type="password"
                          placeholder="Leave empty to keep current token"
                          value={tokenValue}
                          onChange={(e) => setTokenValue(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEditingToken(null)
                          setTokenName("")
                          setTokenValue("")
                        }}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleUpdateToken} disabled={isSubmitting}>
                        {isSubmitting ? "Updating..." : "Update Token"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Token</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{token.name}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteToken(token.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}