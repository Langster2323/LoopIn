import React from 'react'
import { Button } from '../atoms/Button'

export interface NavBarProps {
  title: string
  onSignOut?: () => void
  className?: string
}

export const NavBar: React.FC<NavBarProps> = ({
  title,
  onSignOut,
  className = '',
}) => {
  return (
    <nav
      className={`bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <h1 className="text-xl font-bold text-black dark:text-zinc-50">
            {title}
          </h1>
          {onSignOut && (
            <Button variant="ghost" size="sm" onClick={onSignOut}>
              Sign Out
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
}

