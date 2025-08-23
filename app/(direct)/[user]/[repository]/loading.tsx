import Image from 'next/image'

export default function Loading() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 p-4 dark:bg-gray-950">
      <div className="flex flex-col items-center gap-4">
        <Image
          alt="v0hub Logo"
          className="h-48 w-auto dark:invert"
          height={200}
          priority
          src="/v0-hub-logo-text-transparent.png"
          width={200}
        />
        <p className="text-gray-600 text-sm dark:text-gray-400">
          <span className="font-bold">Is fetching branch data</span>
        </p>
        <div className="flex gap-2">
          <span className="sr-only">Loading</span>
          <div className="h-2 w-2 animate-bounce rounded-full bg-gray-900 [animation-delay:-0.3s] dark:bg-gray-100" />
          <div className="h-2 w-2 animate-bounce rounded-full bg-gray-900 [animation-delay:-0.15s] dark:bg-gray-100" />
          <div className="h-2 w-2 animate-bounce rounded-full bg-gray-900 dark:bg-gray-100" />
        </div>
      </div>
    </div>
  )
}
