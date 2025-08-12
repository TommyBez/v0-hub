'use client'

import { Globe, Lock } from 'lucide-react'
import TokenDialog from '@/components/token-dialog'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useTokenManager } from '@/hooks/use-token-manager'

interface PrivateChatToggleProps {
  disabled?: boolean
}

export default function PrivateChatToggle({
  disabled,
}: PrivateChatToggleProps) {
  const {
    showTokenDialog,
    setShowTokenDialog,
    handleTokenSaved,
    handlePrivateChatToggle,
    isPrivateChat,
  } = useTokenManager()

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label className="flex items-center gap-2 font-medium text-base">
            {isPrivateChat ? (
              <Lock className="h-4 w-4" />
            ) : (
              <Globe className="h-4 w-4" />
            )}
            {isPrivateChat ? 'Private Chat' : 'Public Chat'}
          </Label>
          <p className="text-muted-foreground text-sm">
            {isPrivateChat
              ? 'Uses your personal v0 api key'
              : 'Uses the default v0 api key'}
          </p>
        </div>
        <Switch
          checked={isPrivateChat}
          disabled={disabled}
          onCheckedChange={handlePrivateChatToggle}
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
