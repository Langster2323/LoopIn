import React from 'react'

export interface AlertProps {
  variant?: 'success' | 'error' | 'warning' | 'info'
  children: React.ReactNode
  className?: string
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  children,
  className = '',
}) => {
  const baseStyles = 'rounded-md p-4'

  const variantStyles = {
    success: 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200',
    error: 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200',
    warning:
      'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200',
    info: 'bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200',
  }

  return (
    <div className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      <p className="text-sm">{children}</p>
    </div>
  )
}

