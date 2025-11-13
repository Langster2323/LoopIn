import React from 'react'
import { NavBar } from '../organisms/NavBar'

export interface DashboardLayoutProps {
  title: string
  onSignOut?: () => void
  children: React.ReactNode
  className?: string
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  title,
  onSignOut,
  children,
  className = '',
}) => {
  return (
    <div className={`min-h-screen bg-zinc-50 dark:bg-black ${className}`}>
      <NavBar title={title} onSignOut={onSignOut} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}

