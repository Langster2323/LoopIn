'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { AuthForm } from '@/components/organisms/AuthForm'

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
    <AuthForm
      title="Sign In"
      fields={[
        {
          name: 'email',
          label: 'Email address',
          type: 'email',
          value: email,
          onChange: setEmail,
          required: true,
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
          autoComplete: 'current-password',
          placeholder: '••••••••',
        },
      ]}
      onSubmit={handleSubmit}
      submitLabel="Sign in"
      isLoading={signInMutation.isPending}
      error={signInMutation.error}
      footerLink={{
        text: 'Or',
        href: '/signup',
        linkText: 'create a new account',
      }}
    />
  )
}
