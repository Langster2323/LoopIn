'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

interface Invitation {
  id: string
  email: string
  status: string
  created_at: string
  accepted_at: string | null
}

interface Conversion {
  id: string
  converted_at: string
  invitee: {
    email: string
    full_name: string
  }
}

interface Metrics {
  totalInvitations: number
  acceptedInvitations: number
  pendingInvitations: number
  totalConversions: number
  conversionRate: number
}

export default function DashboardPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [user, setUser] = useState<any>(null)
  const [inviteEmail, setInviteEmail] = useState('')

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)
    })
  }, [router])

  // Fetch invitations
  const { data: invitationsData } = useQuery({
    queryKey: ['invitations'],
    queryFn: async () => {
      const response = await fetch('/api/invitations/list')
      if (!response.ok) throw new Error('Failed to fetch invitations')
      return response.json()
    },
    enabled: !!user,
  })

  // Fetch conversions and metrics
  const { data: analyticsData } = useQuery({
    queryKey: ['analytics', 'conversions'],
    queryFn: async () => {
      const response = await fetch('/api/analytics/conversions')
      if (!response.ok) throw new Error('Failed to fetch analytics')
      return response.json()
    },
    enabled: !!user,
  })

  const invitations: Invitation[] = invitationsData?.invitations || []
  const conversions: Conversion[] = analyticsData?.conversions || []
  const metrics: Metrics | null = analyticsData?.metrics || null

  // Create invitation mutation
  const createInvitationMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await fetch('/api/invitations/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create invitation')
      }

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitations'] })
      queryClient.invalidateQueries({ queryKey: ['analytics'] })
      setInviteEmail('')
    },
  })

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    createInvitationMutation.mutate(inviteEmail)
  }

  const handleSignOut = async () => {
    await fetch('/api/auth/signout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  const copyInviteLink = (link: string) => {
    navigator.clipboard.writeText(link)
    // You could add a toast notification here
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <p className="text-black dark:text-zinc-50">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <nav className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold text-black dark:text-zinc-50">Loops Admin</h1>
            <button
              onClick={handleSignOut}
              className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-zinc-50"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-black dark:text-zinc-50 mb-2">
            Welcome back{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ''}!
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            Manage your invitations and track conversions
          </p>
        </div>

        {/* Metrics Cards */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Total Invitations</p>
              <p className="text-2xl font-bold text-black dark:text-zinc-50">{metrics.totalInvitations}</p>
            </div>
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Accepted</p>
              <p className="text-2xl font-bold text-green-600">{metrics.acceptedInvitations}</p>
            </div>
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{metrics.pendingInvitations}</p>
            </div>
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Conversion Rate</p>
              <p className="text-2xl font-bold text-blue-600">{metrics.conversionRate}%</p>
            </div>
          </div>
        )}

        {/* Invite Friend Section */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow mb-8">
          <h3 className="text-lg font-semibold text-black dark:text-zinc-50 mb-4">
            Invite a Friend
          </h3>
          <form onSubmit={handleInvite} className="space-y-4">
            <div className="flex gap-4">
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="friend@example.com"
                required
                className="flex-1 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-black dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-500 focus:border-black dark:focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-zinc-500"
              />
              <button
                type="submit"
                disabled={createInvitationMutation.isPending}
                className="px-6 py-2 bg-black dark:bg-zinc-50 text-white dark:text-black rounded-md hover:bg-zinc-800 dark:hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-zinc-500 disabled:opacity-50"
              >
                {createInvitationMutation.isPending ? 'Sending...' : 'Send Invite'}
              </button>
            </div>
            {createInvitationMutation.isError && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {createInvitationMutation.error instanceof Error
                  ? createInvitationMutation.error.message
                  : 'Failed to create invitation'}
              </p>
            )}
            {createInvitationMutation.isSuccess && createInvitationMutation.data?.inviteLink && (
              <div className="space-y-2">
                <p className="text-sm text-green-600 dark:text-green-400">
                  Invitation sent! Share this link:
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={createInvitationMutation.data.inviteLink}
                    className="flex-1 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-black dark:text-zinc-50"
                  />
                  <button
                    type="button"
                    onClick={() => copyInviteLink(createInvitationMutation.data.inviteLink)}
                    className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-black dark:text-zinc-50 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-700 text-sm"
                  >
                    Copy
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Invitations List */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow mb-8">
          <h3 className="text-lg font-semibold text-black dark:text-zinc-50 mb-4">
            Your Invitations
          </h3>
          {invitations.length === 0 ? (
            <p className="text-zinc-600 dark:text-zinc-400">No invitations yet. Invite your first friend!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      Sent
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      Accepted
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-zinc-900 divide-y divide-zinc-200 dark:divide-zinc-800">
                  {invitations.map((invitation) => (
                    <tr key={invitation.id}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-black dark:text-zinc-50">
                        {invitation.email}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            invitation.status === 'accepted'
                              ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                              : invitation.status === 'pending'
                              ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200'
                              : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200'
                          }`}
                        >
                          {invitation.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-400">
                        {new Date(invitation.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-400">
                        {invitation.accepted_at
                          ? new Date(invitation.accepted_at).toLocaleDateString()
                          : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Conversions List */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-black dark:text-zinc-50 mb-4">
            Conversions ({conversions.length})
          </h3>
          {conversions.length === 0 ? (
            <p className="text-zinc-600 dark:text-zinc-400">
              No conversions yet. When your invited friends sign up, they'll appear here.
            </p>
          ) : (
            <div className="space-y-4">
              {conversions.map((conversion) => (
                <div
                  key={conversion.id}
                  className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-black dark:text-zinc-50">
                        {conversion.invitee?.full_name || 'Unknown User'}
                      </p>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        {conversion.invitee?.email}
                      </p>
                    </div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {new Date(conversion.converted_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

