import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-3xl font-bold text-foreground mb-4">Page Not Found</h2>
      <p className="text-muted-foreground mb-8">Could not find the requested resource</p>
      <Button asChild>
        <Link href="/super-admin/dashboard">Return to Dashboard</Link>
      </Button>
    </div>
  )
}
