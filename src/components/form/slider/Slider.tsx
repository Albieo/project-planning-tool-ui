import { ErrorMessages } from '../error-messages/ErrorMessages'
import { Label } from '#/components/ui/label'
import { useFieldMeta } from '#/hooks/form'
import { Slider as ShadcnSlider } from '#/components/ui/slider'

export function Slider({ label }: { readonly label: string }) {
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
