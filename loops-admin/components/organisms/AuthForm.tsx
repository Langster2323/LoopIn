'use client'

import React, { FormEvent } from 'react'
import { FormField } from '../molecules/FormField'
import { Button } from '../atoms/Button'
import { Alert } from '../atoms/Alert'
import Link from 'next/link'

export interface AuthFormField {
  name: string
  label: string
  type: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  disabled?: boolean
  autoComplete?: string
  placeholder?: string
}

export interface AuthFormProps {
  title: string
  fields: AuthFormField[]
  onSubmit: (e: FormEvent) => void
  submitLabel: string
  isLoading?: boolean
  error?: string | Error | null
  footerLink?: {
    text: string
    href: string
    linkText: string
  }
  infoMessage?: React.ReactNode
  className?: string
}

export const AuthForm: React.FC<AuthFormProps> = ({
  title,
  fields,
  onSubmit,
  submitLabel,
  isLoading = false,
  error,
  footerLink,
  infoMessage,
  className = '',
}) => {
  return (
    <div
      className={`flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black px-4 ${className}`}
    >
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-zinc-900 p-8 rounded-lg shadow-lg">
        <div>
          <h2 className="text-3xl font-bold text-center text-black dark:text-zinc-50">
            {title}
          </h2>
          {footerLink && (
            <p className="mt-2 text-center text-sm text-zinc-600 dark:text-zinc-400">
              {footerLink.text}{' '}
              <Link
                href={footerLink.href}
                className="font-medium text-black dark:text-zinc-50 hover:underline"
              >
                {footerLink.linkText}
              </Link>
            </p>
          )}
          {infoMessage && <div className="mt-4">{infoMessage}</div>}
        </div>
        <form className="mt-8 space-y-6" onSubmit={onSubmit}>
          {error && (
            <Alert variant="error">
              {error instanceof Error ? error.message : error}
            </Alert>
          )}
          <div className="space-y-4">
            {fields.map((field) => (
              <FormField
                key={field.name}
                label={field.label}
                required={field.required}
                inputProps={{
                  id: field.name,
                  name: field.name,
                  type: field.type,
                  value: field.value,
                  onChange: (e) => field.onChange(e.target.value),
                  required: field.required,
                  disabled: field.disabled,
                  autoComplete: field.autoComplete,
                  placeholder: field.placeholder,
                }}
              />
            ))}
          </div>
          <div>
            <Button
              type="submit"
              disabled={isLoading}
              isLoading={isLoading}
              className="w-full"
            >
              {submitLabel}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

