import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get all conversions for this user
  const { data: conversions, error: convError } = await supabase
    .from('conversions')
    .select(
      `
      *,
      invitee:profiles!conversions_invitee_id_fkey(id, email, full_name, created_at)
    `
    )
    .eq('inviter_id', user.id)
    .order('converted_at', { ascending: false })

  if (convError) {
    return NextResponse.json({ error: convError.message }, { status: 400 })
  }

  // Get invitation stats
  const { data: invitations, error: invError } = await supabase
    .from('invitations')
    .select('*')
    .eq('inviter_id', user.id)

  if (invError) {
    return NextResponse.json({ error: invError.message }, { status: 400 })
  }

  // Calculate metrics
  const totalInvitations = invitations?.length || 0
  const acceptedInvitations =
    invitations?.filter((inv) => inv.status === 'accepted').length || 0
  const pendingInvitations =
    invitations?.filter((inv) => inv.status === 'pending').length || 0
  const totalConversions = conversions?.length || 0
  const conversionRate =
    totalInvitations > 0 ? (totalConversions / totalInvitations) * 100 : 0

  return NextResponse.json({
    conversions: conversions || [],
    metrics: {
      totalInvitations,
      acceptedInvitations,
      pendingInvitations,
      totalConversions,
      conversionRate: Math.round(conversionRate * 100) / 100,
    },
  })
}
