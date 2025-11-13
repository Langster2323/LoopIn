'use client'

import React, { useState, useEffect, FormEvent } from 'react'
import { Card } from '../atoms/Card'
import { Input } from '../atoms/Input'
import { Button } from '../atoms/Button'
import { Alert } from '../atoms/Alert'

export interface InviteFormProps {
  onSubmit: (email: string) => void
  isLoading?: boolean
  error?: string | Error | null
  successMessage?: string
  inviteLink?: string
  onCopyLink?: (link: string) => void
  className?: string
}

export const InviteForm: React.FC<InviteFormProps> = ({
  onSubmit,
  isLoading = false,
  error,
  successMessage,
  inviteLink,
  onCopyLink,
  className = '',
}) => {
  const [email, setEmail] = useState('')

  // Clear email on successful submission
  useEffect(() => {
    if (inviteLink) {
      setEmail('')
    }
  }, [inviteLink])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit(email)
  }

  return (
    <Card className={className}>
      <h3 className="text-lg font-semibold text-black dark:text-zinc-50 mb-4">
        Invite a Friend
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-4">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="friend@example.com"
            required
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading} isLoading={isLoading}>
            {isLoading ? 'Sending...' : 'Send Invite'}
          </Button>
        </div>
        {error && (
          <Alert variant="error">
            {error instanceof Error ? error.message : error}
          </Alert>
        )}
        {successMessage && inviteLink && (
          <div className="space-y-2">
            <Alert variant="success">{successMessage}</Alert>
            <div className="flex gap-2">
              <Input
                type="text"
                readOnly
                value={inviteLink}
                className="flex-1 text-sm"
              />
              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={() => onCopyLink?.(inviteLink)}
              >
                Copy
              </Button>
            </div>
          </div>
        )}
      </form>
    </Card>
  )
}

