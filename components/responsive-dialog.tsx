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
  Sheet as BaseSheet,
  SheetClose as BaseSheetClose,
  SheetContent as BaseSheetContent,
  SheetDescription as BaseSheetDescription,
  SheetFooter as BaseSheetFooter,
  SheetHeader as BaseSheetHeader,
  SheetTitle as BaseSheetTitle,
  SheetTrigger as BaseSheetTrigger,
} from '@/components/ui/sheet'
import { useIsMobile } from '@/hooks/use-mobile'

// Root
export function Dialog(props: React.ComponentProps<typeof BaseDialog>) {
  const isMobile = useIsMobile()
  return isMobile ? <BaseSheet {...props} /> : <BaseDialog {...props} />
}

// Trigger
export function DialogTrigger(
  props: React.ComponentProps<typeof BaseDialogTrigger>,
) {
  const isMobile = useIsMobile()
  return isMobile ? (
    <BaseSheetTrigger {...props} />
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
    <BaseSheetClose {...props} />
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
      <BaseSheetContent
        className={
          typeof className === 'string' ? `px-[2px] ${className}` : 'px-[2px]'
        }
        side="bottom"
        {...props}
      >
        {children}
      </BaseSheetContent>
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
    <BaseSheetHeader {...props} />
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
    <BaseSheetFooter {...props} />
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
    <BaseSheetTitle {...props} />
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
    <BaseSheetDescription {...props} />
  ) : (
    <BaseDialogDescription {...props} />
  )
}
