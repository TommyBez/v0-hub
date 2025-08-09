'use client'

import type * as React from 'react'
import {
  Dialog as BaseDialog,
  DialogClose as BaseDialogClose,
  DialogContent as BaseDialogContent,
  DialogDescription as BaseDialogDescription,
  DialogFooter as BaseDialogFooter,
  DialogHeader as BaseDialogHeader,
  DialogTitle as BaseDialogTitle,
  DialogTrigger as BaseDialogTrigger,
} from '@/components/ui/dialog'
import {
  Drawer as BaseDrawer,
  DrawerClose as BaseDrawerClose,
  DrawerContent as BaseDrawerContent,
  DrawerDescription as BaseDrawerDescription,
  DrawerFooter as BaseDrawerFooter,
  DrawerHeader as BaseDrawerHeader,
  DrawerTitle as BaseDrawerTitle,
  DrawerTrigger as BaseDrawerTrigger,
} from '@/components/ui/drawer'
import { useIsMobile } from '@/hooks/use-mobile'

// Root
export function Dialog(props: React.ComponentProps<typeof BaseDialog>) {
  const isMobile = useIsMobile()
  return isMobile ? <BaseDrawer {...props} /> : <BaseDialog {...props} />
}

// Trigger
export function DialogTrigger(
  props: React.ComponentProps<typeof BaseDialogTrigger>,
) {
  const isMobile = useIsMobile()
  return isMobile ? (
    <BaseDrawerTrigger {...props} />
  ) : (
    <BaseDialogTrigger {...props} />
  )
}

// Close
export function DialogClose(
  props: React.ComponentProps<typeof BaseDialogClose>,
) {
  const isMobile = useIsMobile()
  return isMobile ? (
    <BaseDrawerClose {...props} />
  ) : (
    <BaseDialogClose {...props} />
  )
}

// Content
export function DialogContent({
  className,
  children,
  showCloseButton,
  ...props
}: React.ComponentProps<typeof BaseDialogContent>) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <BaseDrawerContent
        className={
          typeof className === 'string' ? `px-[2px] ${className}` : 'px-[2px]'
        }
        {...props}
      >
        {children}
      </BaseDrawerContent>
    )
  }

  return (
    <BaseDialogContent
      className={className}
      {...props}
      showCloseButton={showCloseButton}
    >
      {children}
    </BaseDialogContent>
  )
}

// Header
export function DialogHeader(
  props: React.ComponentProps<typeof BaseDialogHeader>,
) {
  const isMobile = useIsMobile()
  return isMobile ? (
    <BaseDrawerHeader {...props} />
  ) : (
    <BaseDialogHeader {...props} />
  )
}

// Footer
export function DialogFooter(
  props: React.ComponentProps<typeof BaseDialogFooter>,
) {
  const isMobile = useIsMobile()
  return isMobile ? (
    <BaseDrawerFooter {...props} />
  ) : (
    <BaseDialogFooter {...props} />
  )
}

// Title
export function DialogTitle(
  props: React.ComponentProps<typeof BaseDialogTitle>,
) {
  const isMobile = useIsMobile()
  return isMobile ? (
    <BaseDrawerTitle {...props} />
  ) : (
    <BaseDialogTitle {...props} />
  )
}

// Description
export function DialogDescription(
  props: React.ComponentProps<typeof BaseDialogDescription>,
) {
  const isMobile = useIsMobile()
  return isMobile ? (
    <BaseDrawerDescription {...props} />
  ) : (
    <BaseDialogDescription {...props} />
  )
}
