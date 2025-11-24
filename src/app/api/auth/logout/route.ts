import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function GET() {
  const supabase = await createClient()

  // Sign out from Supabase
  await supabase.auth.signOut()

  // Redirect to home page
  redirect('/')
}
