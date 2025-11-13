'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useMutation, useQuery } from '@tanstack/react-query'
import { AuthForm } from '@/components/organisms/AuthForm'
import { Alert } from '@/components/atoms/Alert'

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

      // Check if response is JSON
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text()
        throw new Error(
          `Server error: ${response.status} ${response.statusText}`
        )
      }

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

  const infoMessage =
    invitationData?.invitation ? (
      <Alert variant="info">
        You've been invited by{' '}
        {invitationData.invitation.inviter?.full_name || 'a friend'}!
      </Alert>
    ) : undefined

  return (
    <AuthForm
      title="Create Account"
      fields={[
        {
          name: 'fullName',
          label: 'Full Name',
          type: 'text',
          value: fullName,
          onChange: setFullName,
          required: true,
          placeholder: 'John Doe',
        },
        {
          name: 'email',
          label: 'Email address',
          type: 'email',
          value: email,
          onChange: setEmail,
          required: true,
          disabled: !!invitationToken,
          autoComplete: 'email',
          placeholder: 'you@example.com',
        },
        {
          name: 'password',
          label: 'Password',
          type: 'password',
          value: password,
          onChange: setPassword,
          required: true,
          autoComplete: 'new-password',
          placeholder: '••••••••',
        },
      ]}
      onSubmit={handleSubmit}
      submitLabel="Create account"
      isLoading={signUpMutation.isPending}
      error={signUpMutation.error}
      footerLink={{
        text: 'Or',
        href: '/login',
        linkText: 'sign in to your existing account',
      }}
      infoMessage={infoMessage}
    />
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
