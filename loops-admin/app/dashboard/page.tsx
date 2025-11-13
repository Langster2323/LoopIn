'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { DashboardLayout } from '@/components/templates/DashboardLayout'
import { MetricsGrid } from '@/components/organisms/MetricsGrid'
import { InviteForm } from '@/components/organisms/InviteForm'
import { InvitationsTable } from '@/components/organisms/InvitationsTable'
import { ConversionsList } from '@/components/organisms/ConversionsList'
import type { Metrics, Invitation, Conversion } from '@/components/organisms'


export default function DashboardPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [user, setUser] = useState<any>(null)

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
    },
  })


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
    <DashboardLayout title="Loops Admin" onSignOut={handleSignOut}>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-black dark:text-zinc-50 mb-2">
          Welcome back
          {user?.user_metadata?.full_name
            ? `, ${user.user_metadata.full_name}`
            : ''}
          !
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400">
          Manage your invitations and track conversions
        </p>
      </div>

      {metrics && <MetricsGrid metrics={metrics} className="mb-8" />}

      <InviteForm
        onSubmit={(email) => createInvitationMutation.mutate(email)}
        isLoading={createInvitationMutation.isPending}
        error={createInvitationMutation.error}
        successMessage="Invitation sent! Share this link:"
        inviteLink={createInvitationMutation.data?.inviteLink}
        onCopyLink={copyInviteLink}
        className="mb-8"
      />

      <InvitationsTable invitations={invitations} className="mb-8" />

      <ConversionsList conversions={conversions} />
    </DashboardLayout>
  )
}
