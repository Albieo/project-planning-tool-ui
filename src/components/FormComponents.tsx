import { useFormContext } from '#/hooks/form-context'

import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Textarea as ShadcnTextarea } from '#/components/ui/textarea'
import * as ShadcnSelect from '#/components/ui/select'
import { Slider as ShadcnSlider } from '#/components/ui/slider'
import { Switch as ShadcnSwitch } from '#/components/ui/switch'
import { Label } from '#/components/ui/label'
import type { ReactElement } from 'react'
import { useFieldMeta } from '#/hooks/form'

export function SubscribeButton({ label }: { label: string }) {
  const form = useFormContext()

  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Loading...' : label}
        </Button>
      )}
    </form.Subscribe>
  )
}

function ErrorMessages({
  errors,
  id,
}: {
  errors: Array<string | { message: string }>
  id: string
}) {
  return (
    <div id={id} className="mt-1 space-y-1 text-sm font-medium text-red-500">
      {errors.map((error) => (
        <div key={typeof error === 'string' ? error : error.message}>
          {typeof error === 'string' ? error : error.message}
        </div>
      ))}
    </div>
  )
}

export function TextField({
  label,
  placeholder,
  type,
  forgotPassword,
  autoComplete,
}: {
  label: string
  placeholder?: string
  autoComplete?: string
  type?: 'text' | 'password' | 'email'
  forgotPassword?: ReactElement
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
        className={`
          ${hasError ? 'border-red-500 focus:ring-red-500' : ''}
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

export function TextArea({
  label,
  rows = 3,
}: {
  label: string
  rows?: number
}) {
  const { field, errors, hasError, errorId } = useFieldMeta<string>()

  return (
    <div>
      <Label
        htmlFor={label}
        className={`mb-2 text-xl font-bold ${hasError ? 'text-red-500' : ''}`}
      >
        {label}
      </Label>
      <ShadcnTextarea
        className={hasError ? 'border-red-500 focus:ring-red-500' : ''}
        id={label}
        value={field.state.value}
        onBlur={field.handleBlur}
        rows={rows}
        onChange={(e) => field.handleChange(e.target.value)}
      />
      {field.state.meta.isTouched && (
        <ErrorMessages id={errorId} errors={errors} />
      )}
    </div>
  )
}

export function Select({
  label,
  values,
  placeholder,
}: {
  label: string
  values: Array<{ label: string; value: string }>
  placeholder?: string
}) {
  const { field, errors, hasError, errorId } = useFieldMeta<string>()

  return (
    <div>
      <ShadcnSelect.Select
        name={field.name}
        value={field.state.value}
        onValueChange={(value) => field.handleChange(value)}
      >
        <ShadcnSelect.SelectTrigger
          className={`w-full ${
            hasError ? 'border-red-500 focus:ring-red-500' : ''
          }`}
          aria-invalid={hasError}
        >
          <ShadcnSelect.SelectValue placeholder={placeholder} />
        </ShadcnSelect.SelectTrigger>
        <ShadcnSelect.SelectContent className="bg-background text-foreground">
          <ShadcnSelect.SelectGroup>
            <ShadcnSelect.SelectLabel>{label}</ShadcnSelect.SelectLabel>
            {values.map((value) => (
              <ShadcnSelect.SelectItem
                key={value.value}
                value={value.value}
                className="text-foreground"
              >
                {value.label}
              </ShadcnSelect.SelectItem>
            ))}
          </ShadcnSelect.SelectGroup>
        </ShadcnSelect.SelectContent>
      </ShadcnSelect.Select>
      {field.state.meta.isTouched && (
        <ErrorMessages id={errorId} errors={errors} />
      )}
    </div>
  )
}

export function Slider({ label }: { label: string }) {
  const { field, errors, hasError, errorId } = useFieldMeta<number>()

  return (
    <div>
      <Label
        htmlFor={label}
        className={`mb-2 text-xl font-bold ${hasError ? 'text-red-500' : ''}`}
      >
        {label}
      </Label>
      <ShadcnSlider
        id={label}
        className={
          hasError
            ? '[&_[role=slider]]:ring-2 [&_[role=slider]]:ring-red-500'
            : ''
        }
        onBlur={field.handleBlur}
        value={[field.state.value]}
        onValueChange={(value) => field.handleChange(value[0])}
      />
      {field.state.meta.isTouched && (
        <ErrorMessages id={errorId} errors={errors} />
      )}
    </div>
  )
}

export function Switch({ label }: { label: string }) {
  const { field, errors, hasError, errorId } = useFieldMeta<boolean>()

  return (
    <div>
      <div className="flex items-center gap-2">
        <ShadcnSwitch
          id={label}
          className={hasError ? 'data-[state=checked]:bg-red-500' : ''}
          onBlur={field.handleBlur}
          checked={field.state.value}
          onCheckedChange={(checked) => field.handleChange(checked)}
        />
        <Label htmlFor={label}>{label}</Label>
      </div>
      {field.state.meta.isTouched && (
        <ErrorMessages id={errorId} errors={errors} />
      )}
    </div>
  )
}
