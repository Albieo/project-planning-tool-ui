import { useFieldMeta } from '#/hooks/form'
import * as ShadcnSelect from '#/components/ui/select'
import { ErrorMessages } from '../error-messages/ErrorMessages'

export function Select({
  label,
  values,
  placeholder,
}: {
  readonly label: string
  readonly values: ReadonlyArray<{
    readonly label: string
    readonly value: string
  }>
  readonly placeholder?: string
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
