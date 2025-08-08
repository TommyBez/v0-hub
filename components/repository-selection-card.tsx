import { SiGithub } from '@icons-pack/react-simple-icons'
import RepositoryForm from '@/components/repository-form'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Animated } from '@/components/animated'

interface RepositorySelectionCardProps {
  title?: string
  description?: string
  disabled?: boolean
  showHeader?: boolean
}

export default function RepositorySelectionCard({
  title = 'Bootstrap Chat from GitHub',
  description = 'Initialize a new v0 chat instance from a public GitHub repository.',
  showHeader = true,
}: RepositorySelectionCardProps) {
  return (
    <Animated hoverScale={1.01} className="relative overflow-hidden">
      <Card className="relative overflow-hidden border-primary/20 shadow-primary/5 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
        {showHeader && (
          <CardHeader className="relative">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-3 backdrop-blur-sm">
                <SiGithub className="h-8 w-8 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </div>
            </div>
          </CardHeader>
        )}
        <CardContent>
          <RepositoryForm showHeader={showHeader} />
        </CardContent>
      </Card>
    </Animated>
  )
}
