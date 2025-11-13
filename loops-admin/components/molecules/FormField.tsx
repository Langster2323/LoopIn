import React from 'react'
import { Input, InputProps } from '../atoms/Input'
import { Label, LabelProps } from '../atoms/Label'

export interface FormFieldProps {
  label: string
  labelProps?: Omit<LabelProps, 'children'>
  inputProps: InputProps
  error?: string
  required?: boolean
  className?: string
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  labelProps,
  inputProps,
  error,
  required,
  className = '',
}) => {
  return (
    <div className={className}>
      <Label htmlFor={inputProps.id} required={required} {...labelProps}>
        {label}
      </Label>
      <div className="mt-1">
        <Input
          {...inputProps}
          error={!!error}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputProps.id}-error` : undefined}
        />
      </div>
      {error && (
        <p
          id={`${inputProps.id}-error`}
          className="mt-1 text-sm text-red-600 dark:text-red-400"
        >
          {error}
        </p>
      )}
    </div>
  )
}

