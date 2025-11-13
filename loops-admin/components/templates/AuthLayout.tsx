import React from 'react'

export interface AuthLayoutProps {
  children: React.ReactNode
  className?: string
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  className = '',
}) => {
  return (
    <div
      className={`flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black px-4 ${className}`}
    >
      {children}
    </div>
  )
}

