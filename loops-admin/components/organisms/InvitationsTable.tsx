import React from 'react'
import { Card } from '../atoms/Card'
import { StatusBadge } from '../molecules/StatusBadge'

export interface Invitation {
  id: string
  email: string
  status: string
  created_at: string
  accepted_at: string | null
}

export interface InvitationsTableProps {
  invitations: Invitation[]
  className?: string
}

export const InvitationsTable: React.FC<InvitationsTableProps> = ({
  invitations,
  className = '',
}) => {
  if (invitations.length === 0) {
    return (
      <Card className={className}>
        <h3 className="text-lg font-semibold text-black dark:text-zinc-50 mb-4">
          Your Invitations
        </h3>
        <p className="text-zinc-600 dark:text-zinc-400">
          No invitations yet. Invite your first friend!
        </p>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <h3 className="text-lg font-semibold text-black dark:text-zinc-50 mb-4">
        Your Invitations
      </h3>
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
                  <StatusBadge status={invitation.status} />
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
    </Card>
  )
}

