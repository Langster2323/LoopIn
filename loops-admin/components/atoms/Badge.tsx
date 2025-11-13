import React from 'react'

export interface BadgeProps {
  variant?: 'success' | 'warning' | 'error' | 'info' | 'default'
  children: React.ReactNode
  className?: string
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  children,
  className = '',
}) => {
  const baseStyles = 'px-2 py-1 text-xs font-medium rounded-full'

  const variantStyles = {
    success:
      'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200',
    warning:
      'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200',
    error: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200',
    info: 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200',
    default:
      'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200',
  }

  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  )
}

