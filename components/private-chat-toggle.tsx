'use client'

import { Globe, Lock } from 'lucide-react'
import { useQueryState } from 'nuqs'
import TokenDialog from '@/components/token-dialog'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useTokenManager } from '@/hooks/use-token-manager'
import { privateChatParser } from '@/lib/search-params'

interface PrivateChatToggleProps {
  disabled?: boolean
}

export default function PrivateChatToggle({
  disabled,
}: PrivateChatToggleProps) {
  const [privateChat, setPrivateChat] = useQueryState(
    'privateChat',
    privateChatParser,
  )

  const { showTokenDialog, setShowTokenDialog, handleTokenSaved } =
    useTokenManager()

  const handleToggle = (checked: boolean) => {
    setPrivateChat(checked)
    if (checked) {
      // Check if token exists when enabling private chat
      const token = localStorage.getItem('v0-token')
      if (!token) {
        setShowTokenDialog(true)
      }
    }
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label className="flex items-center gap-2 font-medium text-base">
            {privateChat ? (
              <Lock className="h-4 w-4" />
            ) : (
              <Globe className="h-4 w-4" />
            )}
            {privateChat ? 'Private Chat' : 'Public Chat'}
          </Label>
          <p className="text-muted-foreground text-sm">
            {privateChat
              ? 'Uses your personal v0 api key'
              : 'Uses the default v0 api key'}
          </p>
        </div>
        <Switch
          checked={privateChat}
          disabled={disabled}
          onCheckedChange={handleToggle}
        />
      </div>

      <TokenDialog
        onOpenChange={setShowTokenDialog}
        onTokenSaved={handleTokenSaved}
        open={showTokenDialog}
      />
    </>
  )
}
