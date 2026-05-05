import { Button } from '#/components/ui/button'
import { useFormContext } from '#/hooks/form-context'

export function SubscribeButton({ label }: { readonly label: string }) {
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
