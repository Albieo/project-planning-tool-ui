import { useFieldMeta } from '#/hooks/form'
import { Textarea as ShadcnTextarea } from '#/components/ui/textarea'
import { Label } from '#/components/ui/label'
import { ErrorMessages } from '../error-messages/ErrorMessages'

export function TextArea({
  label,
  rows = 3,
}: {
  readonly label: string
  readonly rows?: number
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
