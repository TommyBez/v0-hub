import { redirect } from 'next/navigation'
import { fetchGitHubBranches } from '@/app/actions'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ user: string; repository: string }> },
) {
  const { user, repository } = await params
  const repoUrl = `https://github.com/${user}/${repository}`
  const result = await fetchGitHubBranches(repoUrl)

  if (result.success && result.branches) {
    // Check if main or master branch exists
    const mainBranch = result.branches.find((branch) => branch === 'main')
    const masterBranch = result.branches.find((branch) => branch === 'master')

    // Redirect to main or master branch if available
    if (mainBranch) {
      redirect(`/${user}/${repository}/tree/main`)
    } else if (masterBranch) {
      redirect(`/${user}/${repository}/tree/master`)
    }
  }
  redirect(`dashboard/${user}/${repository}`)
}
