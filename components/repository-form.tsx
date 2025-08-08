'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Globe, Loader2, Lock } from 'lucide-react'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import BranchSelector from '@/components/branch-selector'
import TokenDialog from '@/components/token-dialog'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { useFormSubmission } from '@/hooks/use-form-submission'
import { useTokenManager } from '@/hooks/use-token-manager'

const formSchema = z.object({
  repoUrl: z.string().url('Please enter a valid GitHub URL'),
  branch: z.string().min(1, 'Please select a branch'),
  isPrivateChat: z.boolean().default(false),
})

type FormData = z.infer<typeof formSchema>

interface RepositoryFormProps {
  showHeader?: boolean
}

export default function RepositoryForm({
  showHeader = true,
}: RepositoryFormProps) {
  const {
    showTokenDialog,
    setShowTokenDialog,
    handlePrivateChatToggle,
    handleTokenSaved,
  } = useTokenManager()

  const { isSubmitting, handleSubmit } = useFormSubmission()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      repoUrl: '',
      branch: '',
      isPrivateChat: false,
    },
  })

  const onSubmit = (data: FormData) => {
    // Create a minimal event object for compatibility with existing handleSubmit
    const event = new Event('submit') as unknown as React.FormEvent
    event.preventDefault = () => {
      // Prevent default form submission
    }

    handleSubmit(event, data.repoUrl, data.branch, data.isPrivateChat)
  }

  // Memoize the branch change handler to prevent infinite loops
  const handleBranchChange = useCallback(
    (value: string) => {
      form.setValue('branch', value)
    },
    [form],
  )

  // Watch form values to sync with token manager
  const watchedIsPrivateChat = form.watch('isPrivateChat')
  const watchedRepoUrl = form.watch('repoUrl')
  const watchedBranch = form.watch('branch')

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className={`relative space-y-4 ${showHeader ? '' : 'pt-6'}`}>
            <FormField
              control={form.control}
              name="repoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium text-base">
                    GitHub Repository URL
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="h-12 text-base"
                      disabled={isSubmitting}
                      placeholder="https://github.com/vercel/next.js"
                      type="url"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <BranchSelector
                isSubmitting={isSubmitting}
                onBranchChange={handleBranchChange}
                repoUrl={watchedRepoUrl}
              />
              {form.formState.errors.branch && (
                <p className="mt-2 text-destructive text-sm">
                  {form.formState.errors.branch.message}
                </p>
              )}
            </div>

            <div className="space-y-4 border-t pt-4">
              <FormField
                control={form.control}
                name="isPrivateChat"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <FormLabel className="flex items-center gap-2 font-medium text-base">
                        {field.value ? (
                          <Lock className="h-4 w-4" />
                        ) : (
                          <Globe className="h-4 w-4" />
                        )}
                        {field.value ? 'Private Chat' : 'Public Chat'}
                      </FormLabel>
                      <FormDescription>
                        {field.value
                          ? 'Uses your personal v0 token'
                          : 'Uses the default v0 token'}
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        disabled={isSubmitting}
                        onCheckedChange={(checked) => {
                          field.onChange(checked)
                          handlePrivateChatToggle(checked)
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="relative mt-6">
            <Button
              className="h-12 w-full font-semibold text-base transition-all hover:scale-[1.02]"
              disabled={isSubmitting || !watchedBranch}
              size="lg"
              type="submit"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Loading your v0 chat...
                </>
              ) : (
                <>
                  {watchedIsPrivateChat ? (
                    <Lock className="mr-2 h-5 w-5" />
                  ) : null}
                  Create {watchedIsPrivateChat ? 'private' : 'v0'} chat
                  <span className="ml-2">→</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>

      <TokenDialog
        onOpenChange={setShowTokenDialog}
        onTokenSaved={handleTokenSaved}
        open={showTokenDialog}
      />
    </>
  )
}
