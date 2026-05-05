export function ErrorMessages({
  errors,
  id,
}: {
  readonly errors: ReadonlyArray<string | { readonly message: string }>
  readonly id: string
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
