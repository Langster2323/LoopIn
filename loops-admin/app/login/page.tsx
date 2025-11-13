'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const signInMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to sign in')
      }

      return data
    },
    onSuccess: () => {
      // Redirect to dashboard
      router.push('/dashboard')
      router.refresh()
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    signInMutation.mutate({ email, password })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black px-4">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-zinc-900 p-8 rounded-lg shadow-lg">
        <div>
          <h2 className="text-3xl font-bold text-center text-black dark:text-zinc-50">
            Sign In
          </h2>
          <p className="mt-2 text-center text-sm text-zinc-600 dark:text-zinc-400">
            Or{' '}
            <Link
              href="/signup"
              className="font-medium text-black dark:text-zinc-50 hover:underline"
            >
              create a new account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {signInMutation.isError && (
            <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
              <p className="text-sm text-red-800 dark:text-red-200">
                {signInMutation.error instanceof Error
                  ? signInMutation.error.message
                  : 'An error occurred. Please try again.'}
              </p>
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-black dark:text-zinc-50"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-black dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-500 focus:border-black dark:focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-zinc-500"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-black dark:text-zinc-50"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-black dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-500 focus:border-black dark:focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-zinc-500"
                placeholder="••••••••"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              disabled={signInMutation.isPending}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black dark:bg-zinc-50 dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {signInMutation.isPending ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
