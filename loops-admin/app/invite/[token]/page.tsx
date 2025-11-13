'use client'

import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'

export default function InvitePage() {
  const params = useParams()
  const token = params.token as string

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['invitation', token],
    queryFn: async () => {
      const response = await fetch(`/api/invitations/${token}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load invitation')
      }

      return data
    },
    enabled: !!token,
  })

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <p className="text-black dark:text-zinc-50">Loading...</p>
      </div>
    )
  }

  if (isError || !data?.invitation) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black px-4">
        <div className="w-full max-w-md space-y-8 bg-white dark:bg-zinc-900 p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold text-black dark:text-zinc-50">
            Invalid Invitation
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            {error instanceof Error
              ? error.message
              : 'This invitation link is invalid or has expired.'}
          </p>
          <Link
            href="/signup"
            className="inline-block text-sm font-medium text-black dark:text-zinc-50 hover:underline"
          >
            Create an account instead
          </Link>
        </div>
      </div>
    )
  }

  const invitation = data.invitation

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black px-4">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-zinc-900 p-8 rounded-lg shadow-lg text-center">
        <div>
          <h2 className="text-3xl font-bold text-black dark:text-zinc-50">
            You're Invited!
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            {invitation.inviter?.full_name || 'A friend'} has invited you to join
          </p>
        </div>
        <div className="space-y-4">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Email: <span className="font-medium text-black dark:text-zinc-50">{invitation.email}</span>
          </p>
          <Link
            href={`/signup?token=${token}`}
            className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black dark:bg-zinc-50 dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-zinc-500"
          >
            Accept Invitation & Sign Up
          </Link>
          <p className="text-xs text-zinc-500 dark:text-zinc-500">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-black dark:text-zinc-50 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

