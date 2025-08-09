'use client'

import { useAuth, useClerk } from '@clerk/nextjs'
import { useCallback, useEffect, useState } from 'react'
import { getUserToken } from '@/app/actions'
import { logger } from '@/lib/logger'

export function useTokenManager() {
  const { isSignedIn } = useAuth()
  const { openSignIn } = useClerk()
  const [isPrivateChat, setIsPrivateChat] = useState(false)
  const [hasToken, setHasToken] = useState(false)
  const [showTokenDialog, setShowTokenDialog] = useState(false)

  const checkUserToken = useCallback(async () => {
    try {
      const { hasToken: userHasToken } = await getUserToken()
      setHasToken(userHasToken)
      if (!userHasToken) {
        setShowTokenDialog(true)
        setIsPrivateChat(false)
      }
    } catch (tokenError) {
      logger.error(`Failed to check token: ${tokenError}`)
    }
  }, [])

  // Check if user has token when private chat is enabled
  useEffect(() => {
    if (isPrivateChat && isSignedIn) {
      checkUserToken()
    }
  }, [isPrivateChat, isSignedIn, checkUserToken])

  const handlePrivateChatToggle = (checked: boolean) => {
    if (checked && !isSignedIn) {
      openSignIn()
      return
    }
    setIsPrivateChat(checked)
  }

  const handleTokenSaved = () => {
    setHasToken(true)
    setIsPrivateChat(true)
  }

  return {
    isPrivateChat,
    hasToken,
    showTokenDialog,
    setShowTokenDialog,
    handlePrivateChatToggle,
    handleTokenSaved,
  }
}
