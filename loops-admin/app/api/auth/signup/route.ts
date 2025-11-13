import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { email, password, fullName, invitationToken } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Sign up the user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || '',
        },
      },
    })

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      )
    }

    // Ensure profile exists (fallback in case trigger didn't fire)
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', authData.user.id)
      .single()

    if (!existingProfile) {
      // Create profile if it doesn't exist
      await supabase.from('profiles').insert({
        id: authData.user.id,
        email: authData.user.email || email,
        full_name: fullName || authData.user.user_metadata?.full_name || '',
      })
    }

    // If there's an invitation token, process the conversion
    if (invitationToken) {
      // Get the invitation
      const { data: invitation, error: invError } = await supabase
        .from('invitations')
        .select('*')
        .eq('token', invitationToken)
        .eq('status', 'pending')
        .single()

      if (!invError && invitation) {
        // Check if invitation is not expired
        const expiresAt = new Date(invitation.expires_at)
        if (expiresAt > new Date()) {
          // Update invitation status
          await supabase
            .from('invitations')
            .update({
              status: 'accepted',
              accepted_at: new Date().toISOString(),
            })
            .eq('id', invitation.id)

          // Create conversion record
          await supabase.from('conversions').insert({
            inviter_id: invitation.inviter_id,
            invitee_id: authData.user.id,
            invitation_id: invitation.id,
          })
        }
      }
    }

    return NextResponse.json({
      user: authData.user,
      message: 'User created successfully',
    })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

