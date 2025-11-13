import React from 'react'
import { Card } from '../atoms/Card'

export interface MetricCardProps {
  label: string
  value: string | number
  valueColor?: 'default' | 'green' | 'yellow' | 'blue' | 'red'
  className?: string
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  valueColor = 'default',
  className = '',
}) => {
  const valueColorStyles = {
    default: 'text-black dark:text-zinc-50',
    green: 'text-green-600',
    yellow: 'text-yellow-600',
    blue: 'text-blue-600',
    red: 'text-red-600',
  }

  return (
    <Card className={className}>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">{label}</p>
      <p className={`text-2xl font-bold ${valueColorStyles[valueColor]}`}>
        {value}
      </p>
    </Card>
  )
}

