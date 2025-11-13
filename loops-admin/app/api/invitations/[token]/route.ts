import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const supabase = await createClient()
  const { token } = await params

  const { data, error } = await supabase
    .from('invitations')
    .select(
      '*, inviter:profiles!invitations_inviter_id_fkey(id, email, full_name)'
    )
    .eq('token', token)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Invitation not found' }, { status: 404 })
  }

  // Check if expired
  const expiresAt = new Date(data.expires_at)
  if (expiresAt < new Date()) {
    return NextResponse.json(
      { error: 'Invitation has expired' },
      { status: 400 }
    )
  }

  // Check if already accepted
  if (data.status === 'accepted') {
    return NextResponse.json(
      { error: 'Invitation has already been accepted' },
      { status: 400 }
    )
  }

  return NextResponse.json({ invitation: data })
}
