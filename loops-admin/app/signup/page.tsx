'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useMutation, useQuery } from '@tanstack/react-query'
import Link from 'next/link'

function SignupForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const invitationToken = searchParams.get('token')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')

  // Fetch invitation details if token exists
  const { data: invitationData } = useQuery({
    queryKey: ['invitation', invitationToken],
    queryFn: async () => {
      if (!invitationToken) return null
      const response = await fetch(`/api/invitations/${invitationToken}`)
      if (!response.ok) return null
      return response.json()
    },
    enabled: !!invitationToken,
  })

  // Set email from invitation if available
  useEffect(() => {
    if (invitationData?.invitation?.email) {
      setEmail(invitationData.invitation.email)
    }
  }, [invitationData])

  const signUpMutation = useMutation({
    mutationFn: async (userData: {
      email: string
      password: string
      fullName: string
      invitationToken: string | null
    }) => {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userData.email,
          password: userData.password,
          fullName: userData.fullName,
          invitationToken: userData.invitationToken,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create account')
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
    signUpMutation.mutate({
      email,
      password,
      fullName,
      invitationToken,
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black px-4">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-zinc-900 p-8 rounded-lg shadow-lg">
        <div>
          <h2 className="text-3xl font-bold text-center text-black dark:text-zinc-50">
            Create Account
          </h2>
          <p className="mt-2 text-center text-sm text-zinc-600 dark:text-zinc-400">
            Or{' '}
            <Link
              href="/login"
              className="font-medium text-black dark:text-zinc-50 hover:underline"
            >
              sign in to your existing account
            </Link>
          </p>
          {invitationData?.invitation && (
            <div className="mt-4 rounded-md bg-blue-50 dark:bg-blue-900/20 p-4">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                You've been invited by{' '}
                {invitationData.invitation.inviter?.full_name || 'a friend'}!
              </p>
            </div>
          )}
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {signUpMutation.isError && (
            <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
              <p className="text-sm text-red-800 dark:text-red-200">
                {signUpMutation.error instanceof Error
                  ? signUpMutation.error.message
                  : 'An error occurred. Please try again.'}
              </p>
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-black dark:text-zinc-50"
              >
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1 block w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-black dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-500 focus:border-black dark:focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-zinc-500"
                placeholder="John Doe"
              />
            </div>
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
                disabled={!!invitationToken}
                className="mt-1 block w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-black dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-500 focus:border-black dark:focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
                autoComplete="new-password"
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
              disabled={signUpMutation.isPending}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black dark:bg-zinc-50 dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {signUpMutation.isPending ? 'Creating account...' : 'Create account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
          <p className="text-black dark:text-zinc-50">Loading...</p>
        </div>
      }
    >
      <SignupForm />
    </Suspense>
  )
}

