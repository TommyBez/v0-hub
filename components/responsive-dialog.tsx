"use client"

import * as React from "react"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Dialog as BaseDialog,
  DialogTrigger as BaseDialogTrigger,
  DialogClose as BaseDialogClose,
  DialogContent as BaseDialogContent,
  DialogHeader as BaseDialogHeader,
  DialogFooter as BaseDialogFooter,
  DialogTitle as BaseDialogTitle,
  DialogDescription as BaseDialogDescription,
} from "@/components/ui/dialog"
import {
  Sheet as BaseSheet,
  SheetTrigger as BaseSheetTrigger,
  SheetClose as BaseSheetClose,
  SheetContent as BaseSheetContent,
  SheetHeader as BaseSheetHeader,
  SheetFooter as BaseSheetFooter,
  SheetTitle as BaseSheetTitle,
  SheetDescription as BaseSheetDescription,
} from "@/components/ui/sheet"

// Root
export function Dialog(
  props: React.ComponentProps<typeof BaseDialog>
) {
  const isMobile = useIsMobile()
  return isMobile ? <BaseSheet {...props} /> : <BaseDialog {...props} />
}

// Trigger
export function DialogTrigger(
  props: React.ComponentProps<typeof BaseDialogTrigger>
) {
  const isMobile = useIsMobile()
  return isMobile ? <BaseSheetTrigger {...props} /> : <BaseDialogTrigger {...props} />
}

// Close
export function DialogClose(
  props: React.ComponentProps<typeof BaseDialogClose>
) {
  const isMobile = useIsMobile()
  return isMobile ? <BaseSheetClose {...props} /> : <BaseDialogClose {...props} />
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
      <BaseSheetContent side="bottom" className={className} {...props}>
        {children}
      </BaseSheetContent>
    )
  }

  return (
    <BaseDialogContent className={className} {...props} showCloseButton={showCloseButton}>
      {children}
    </BaseDialogContent>
  )
}

// Header
export function DialogHeader(
  props: React.ComponentProps<typeof BaseDialogHeader>
) {
  const isMobile = useIsMobile()
  return isMobile ? <BaseSheetHeader {...props} /> : <BaseDialogHeader {...props} />
}

// Footer
export function DialogFooter(
  props: React.ComponentProps<typeof BaseDialogFooter>
) {
  const isMobile = useIsMobile()
  return isMobile ? <BaseSheetFooter {...props} /> : <BaseDialogFooter {...props} />
}

// Title
export function DialogTitle(
  props: React.ComponentProps<typeof BaseDialogTitle>
) {
  const isMobile = useIsMobile()
  return isMobile ? <BaseSheetTitle {...props} /> : <BaseDialogTitle {...props} />
}

// Description
export function DialogDescription(
  props: React.ComponentProps<typeof BaseDialogDescription>
) {
  const isMobile = useIsMobile()
  return isMobile ? (
    <BaseSheetDescription {...props} />
  ) : (
    <BaseDialogDescription {...props} />
  )
}