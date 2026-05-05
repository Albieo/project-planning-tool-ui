import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { useFieldMeta } from '#/hooks/form'
import type { ReactElement } from 'react'
import { ErrorMessages } from '../error-messages/ErrorMessages'

export function TextField({
  label,
  placeholder,
  type,
  forgotPassword,
  autoComplete,
  readOnly,
}: {
  readonly label: string
  readonly placeholder?: string
  readonly autoComplete?: string
  readonly type?: 'text' | 'password' | 'email'
  readonly forgotPassword?: ReactElement
  readonly readOnly?: boolean
}) {
  const { field, errors, hasError, errorId } = useFieldMeta<string>()

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <Label
          htmlFor={field.name}
          className={`text-xl font-bold ${hasError ? 'text-red-500' : ''}`}
        >
          {label}
        </Label>

        {forgotPassword && <div className="text-sm">{forgotPassword}</div>}
      </div>

      <Input
        id={field.name}
        type={type}
        value={field.state.value}
        placeholder={placeholder}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        aria-invalid={hasError}
        aria-describedby={hasError ? errorId : undefined}
        autoComplete={autoComplete}
        readOnly={readOnly}
        className={`
          ${hasError ? 'border-red-500 focus:ring-red-500' : ''}
          ${readOnly ? 'bg-transparent border-transparent focus:border-transparent focus:ring-transparent' : ''}
        `}
      />

      {hasError && (
        <div id={errorId}>
          <ErrorMessages id={errorId} errors={errors} />
        </div>
      )}
    </div>
  )
}
