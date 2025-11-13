import React from 'react'
import { MetricCard } from '../molecules/MetricCard'

export interface Metrics {
  totalInvitations: number
  acceptedInvitations: number
  pendingInvitations: number
  totalConversions: number
  conversionRate: number
}

export interface MetricsGridProps {
  metrics: Metrics
  className?: string
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({
  metrics,
  className = '',
}) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 ${className}`}>
      <MetricCard
        label="Total Invitations"
        value={metrics.totalInvitations}
      />
      <MetricCard
        label="Accepted"
        value={metrics.acceptedInvitations}
        valueColor="green"
      />
      <MetricCard
        label="Pending"
        value={metrics.pendingInvitations}
        valueColor="yellow"
      />
      <MetricCard
        label="Conversion Rate"
        value={`${metrics.conversionRate}%`}
        valueColor="blue"
      />
    </div>
  )
}

