import { redirect } from "next/navigation"
import { fetchGitHubBranches } from "@/app/actions"
import RepositorySelectionCard from "@/components/repository-selection-card"

interface PageProps {
  params: {
    user: string
    repository: string
  }
}

export default async function RepositoryPage({ params }: PageProps) {
  const { user, repository } = params
  const repoUrl = `https://github.com/${user}/${repository}`

  // Fetch branches server-side
  const result = await fetchGitHubBranches(repoUrl)

  if (result.success && result.branches) {
    // Check if main or master branch exists
    const mainBranch = result.branches.find((branch) => branch === "main")
    const masterBranch = result.branches.find((branch) => branch === "master")
    
    // Redirect to main or master branch if available
    if (mainBranch) {
      redirect(`/${user}/${repository}/tree/main`)
    } else if (masterBranch) {
      redirect(`/${user}/${repository}/tree/master`)
    }
  }

  // If no main/master branch or error fetching branches, show branch selection
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
      <div className="w-full max-w-2xl">
        <RepositorySelectionCard
          title="Select Branch"
          description={`Choose a branch from ${user}/${repository} to explore`}
          buttonText="View Repository"
        />
      </div>
    </div>
  )
}