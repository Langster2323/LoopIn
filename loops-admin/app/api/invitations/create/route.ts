import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { randomBytes } from 'crypto'

export async function POST(request: Request) {
  const supabase = await createClient()

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Ensure profile exists (for users who signed up before trigger was set up)
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .single()

  if (!existingProfile) {
    // Create profile if it doesn't exist
    const { error: profileError } = await supabase.from('profiles').insert({
      id: user.id,
      email: user.email || '',
      full_name: user.user_metadata?.full_name || '',
    })

    if (profileError) {
      return NextResponse.json(
        {
          error:
            'Failed to create user profile. Please try signing out and back in.',
        },
        { status: 500 }
      )
    }
  }

  const { email } = await request.json()

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }

  // Generate unique token
  const token = randomBytes(32).toString('hex')

  // Create invitation
  const { data, error } = await supabase
    .from('invitations')
    .insert({
      inviter_id: user.id,
      email,
      token,
      status: 'pending',
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  // Generate invite link
  const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/invite/${token}`

  return NextResponse.json({
    invitation: data,
    inviteLink,
    message: 'Invitation created successfully',
  })
}
