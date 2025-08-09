'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from '@/components/responsive-dialog'

export function ResponsiveDialogExample() {
  const [open, setOpen] = useState(false)

  return (
    <ResponsiveDialog open={open} onOpenChange={setOpen}>
      <ResponsiveDialogTrigger asChild>
        <Button variant="outline">Open Responsive Dialog</Button>
      </ResponsiveDialogTrigger>
      <ResponsiveDialogContent>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Responsive Dialog</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            This dialog appears as a centered modal on desktop and as a bottom drawer on mobile devices.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            Try resizing your browser window to see how this dialog adapts to different screen sizes.
            On mobile devices (screens smaller than 640px), it will slide up from the bottom as a drawer.
          </p>
        </div>
        <ResponsiveDialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setOpen(false)}>
            Confirm
          </Button>
        </ResponsiveDialogFooter>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}