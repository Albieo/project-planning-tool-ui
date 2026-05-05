import { useFieldMeta } from '#/hooks/form'
import { Switch as ShadcnSwitch } from '#/components/ui/switch'
import { Label } from '#/components/ui/label'
import { ErrorMessages } from '../error-messages/ErrorMessages'

export function Switch({ label }: { readonly label: string }) {
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
