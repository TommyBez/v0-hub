"use client"

import RepositorySelectionCard from "@/components/repository-selection-card"

export default function HomePage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
      <div className="w-full max-w-2xl">
        <RepositorySelectionCard
          title="Explore GitHub Repository"
          description="Enter a GitHub repository URL to explore its code and create a v0 chat instance."
        />
      </div>
    </div>
  )
}
