'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        router.push('/dashboard')
      }
    })
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black px-4">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center gap-8 text-center">
        <div className="flex flex-col items-center gap-6">
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-black dark:text-zinc-50">
            Welcome to Loops Admin
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Manage your users, invite friends, and track conversion rates with
            ease.
          </p>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Link
            href="/signup"
            className="flex h-12 w-full items-center justify-center rounded-full bg-black dark:bg-zinc-50 px-6 text-white dark:text-black transition-colors hover:bg-zinc-800 dark:hover:bg-zinc-200 sm:w-auto"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="flex h-12 w-full items-center justify-center rounded-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-6 text-black dark:text-zinc-50 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800 sm:w-auto"
          >
            Sign In
          </Link>
        </div>
      </main>
    </div>
  )
}
