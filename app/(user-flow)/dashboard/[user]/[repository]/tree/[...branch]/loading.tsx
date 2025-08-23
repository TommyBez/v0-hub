export default function Loading() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 p-4 dark:bg-gray-950">
      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-2">
          <span className="sr-only">Loading</span>
          <div className="h-2 w-2 animate-bounce rounded-full bg-gray-900 [animation-delay:-0.3s] dark:bg-gray-100" />
          <div className="h-2 w-2 animate-bounce rounded-full bg-gray-900 [animation-delay:-0.15s] dark:bg-gray-100" />
          <div className="h-2 w-2 animate-bounce rounded-full bg-gray-900 dark:bg-gray-100" />
        </div>
        <p className="text-gray-600 text-sm dark:text-gray-400">
          Creating v0 chat
        </p>
      </div>
    </div>
  )
}
