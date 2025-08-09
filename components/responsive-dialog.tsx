'use client'

import * as React from 'react'
import { useIsMobile } from '@/hooks/use-mobile'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

interface ResponsiveDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

export function ResponsiveDialog({ open, onOpenChange, children }: ResponsiveDialogProps) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        {children}
      </Sheet>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children}
    </Dialog>
  )
}

export function ResponsiveDialogTrigger({ children, ...props }: React.ComponentPropsWithoutRef<typeof DialogTrigger>) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return <SheetTrigger {...props}>{children}</SheetTrigger>
  }

  return <DialogTrigger {...props}>{children}</DialogTrigger>
}

interface ResponsiveDialogContentProps extends React.ComponentPropsWithoutRef<typeof DialogContent> {
  children: React.ReactNode
  className?: string
  showCloseButton?: boolean
}

export function ResponsiveDialogContent({ children, className, showCloseButton = true, ...props }: ResponsiveDialogContentProps) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <SheetContent side="bottom" className={className} {...props}>
        {children}
      </SheetContent>
    )
  }

  return (
    <DialogContent className={className} showCloseButton={showCloseButton} {...props}>
      {children}
    </DialogContent>
  )
}

export function ResponsiveDialogHeader({ children, className, ...props }: React.ComponentPropsWithoutRef<typeof DialogHeader>) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <SheetHeader className={className} {...props}>
        {children}
      </SheetHeader>
    )
  }

  return (
    <DialogHeader className={className} {...props}>
      {children}
    </DialogHeader>
  )
}

export function ResponsiveDialogFooter({ children, className, ...props }: React.ComponentPropsWithoutRef<typeof DialogFooter>) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <SheetFooter className={className} {...props}>
        {children}
      </SheetFooter>
    )
  }

  return (
    <DialogFooter className={className} {...props}>
      {children}
    </DialogFooter>
  )
}

export function ResponsiveDialogTitle({ children, className, ...props }: React.ComponentPropsWithoutRef<typeof DialogTitle>) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <SheetTitle className={className} {...props}>
        {children}
      </SheetTitle>
    )
  }

  return (
    <DialogTitle className={className} {...props}>
      {children}
    </DialogTitle>
  )
}

export function ResponsiveDialogDescription({ children, className, ...props }: React.ComponentPropsWithoutRef<typeof DialogDescription>) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <SheetDescription className={className} {...props}>
        {children}
      </SheetDescription>
    )
  }

  return (
    <DialogDescription className={className} {...props}>
      {children}
    </DialogDescription>
  )
}

export function ResponsiveDialogClose({ children, ...props }: React.ComponentPropsWithoutRef<typeof DialogClose>) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return <SheetClose {...props}>{children}</SheetClose>
  }

  return <DialogClose {...props}>{children}</DialogClose>
}