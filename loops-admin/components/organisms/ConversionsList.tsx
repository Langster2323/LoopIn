import React from 'react'
import { Card } from '../atoms/Card'

export interface Conversion {
  id: string
  converted_at: string
  invitee: {
    email: string
    full_name: string
  } | null
}

export interface ConversionsListProps {
  conversions: Conversion[]
  className?: string
}

export const ConversionsList: React.FC<ConversionsListProps> = ({
  conversions,
  className = '',
}) => {
  return (
    <Card className={className}>
      <h3 className="text-lg font-semibold text-black dark:text-zinc-50 mb-4">
        Conversions ({conversions.length})
      </h3>
      {conversions.length === 0 ? (
        <p className="text-zinc-600 dark:text-zinc-400">
          No conversions yet. When your invited friends sign up, they'll appear
          here.
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
                    {conversion.invitee?.full_name ||
                      conversion.invitee?.email ||
                      'Unknown User'}
                  </p>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {conversion.invitee?.email || 'No email available'}
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
    </Card>
  )
}

