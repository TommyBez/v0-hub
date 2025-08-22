import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 p-4 dark:bg-gray-950">
      <div className="w-full max-w-2xl">
        <Card className="fade-in-50 animate-in">
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-7 w-32" />
            </CardTitle>
            <CardDescription>
              <Skeleton className="mt-1 h-4 w-80" />
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 w-10" />
                <Skeleton className="h-10 w-10" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
