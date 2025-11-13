import React from 'react'
import { Badge } from '../atoms/Badge'

export interface StatusBadgeProps {
  status: 'pending' | 'accepted' | 'expired' | string
  className?: string
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className = '',
}) => {
  const getVariant = (status: string): 'success' | 'warning' | 'error' | 'default' => {
    switch (status.toLowerCase()) {
      case 'accepted':
        return 'success'
      case 'pending':
        return 'warning'
      case 'expired':
        return 'error'
      default:
        return 'default'
    }
  }

  return (
    <Badge variant={getVariant(status)} className={className}>
      {status}
    </Badge>
  )
}

