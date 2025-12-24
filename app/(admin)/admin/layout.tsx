import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      redirect('/admin/login')
    }

    return <>{children}</>
  } catch (error: any) {
    // If Supabase is not configured, redirect to login with error message
    if (error.message?.includes('environment variables are missing')) {
      redirect('/admin/login?error=config')
    }
    redirect('/admin/login')
  }
}

