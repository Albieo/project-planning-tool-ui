import { Button } from '#/components/ui/button'
import { Label } from '#/components/ui/label'
import { useRef, useState } from 'react'
import { ErrorMessages } from '../error-messages/ErrorMessages'
import { useFieldMeta } from '#/hooks/form'

export function PhotoField({
  label = 'Profile Photo',
  accept = 'image/jpeg,image/png,image/webp',
  maxSize = 5 * 1024 * 1024,
}: {
  readonly label?: string
  readonly accept?: string
  readonly maxSize?: number
}) {
  const { field, errors, hasError, errorId } = useFieldMeta<File | undefined>()
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (file) {
      const acceptedTypes = accept.split(',').map((type) => type.trim())
      if (!acceptedTypes.includes(file.type)) {
        field.handleChange(file)
        return
      }

      // Create preview URL
      const previewUrl = URL.createObjectURL(file)

      // Clean up previous preview URL to prevent memory leaks
      if (preview) URL.revokeObjectURL(preview)

      setPreview(previewUrl)
    }

    field.handleChange(file)
    field.handleBlur()
  }

  const handleRemove = () => {
    if (preview) {
      URL.revokeObjectURL(preview)
    }
    setPreview(null)
    field.handleChange(undefined)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }

  return (
    <div>
      <Label
        htmlFor={field.name}
        className={`mb-2 block text-xl font-bold ${hasError ? 'text-red-500' : ''}`}
      >
        {label}
      </Label>

      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          {preview ? (
            <div className="relative group">
              <img
                src={preview}
                alt="profile preview"
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
              />
              <button
                type="button"
                onClick={handleClick}
                onKeyDown={handleKeyDown}
                className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100 focus:bg-opacity-40"
                aria-label="Change profile photo"
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleClick}
              onKeyDown={handleKeyDown}
              className={`w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed transition-colors duration-200 ${
                hasError
                  ? 'border-red-500 hover:border-red-600 focus:ring-red-500'
                  : 'border-gray-300 hover:border-gray-400 focus:ring-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-offset-2`}
              aria-label={`Upload ${label.toLowerCase()}`}
              aria-describedby={hasError ? errorId : `${field.name}-help`}
            >
              <svg
                className={`w-8 h-8 ${hasError ? 'text-red-400' : 'text-gray-400'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </button>
          )}
        </div>

        <input
          ref={fileInputRef}
          id={field.name}
          name={field.name}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          onBlur={field.handleBlur}
          className="sr-only"
          aria-invalid={hasError}
          aria-describedby={
            hasError ? `${errorId} ${field.name}-help` : `${field.name}-help`
          }
          tabIndex={-1}
        />

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClick}
            aria-label={
              preview
                ? `Change ${label.toLowerCase()}`
                : `Upload ${label.toLowerCase()}`
            }
          >
            {preview ? 'Change Photo' : 'Upload Photo'}
          </Button>
          {preview && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleRemove()
                }
              }}
              className="text-red-500 hover:text-red-600 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              aria-label={`Remove ${label.toLowerCase()}`}
            >
              Remove
            </Button>
          )}
        </div>

        <p id={`${field.name}-help`} className="text-xs text-gray-500">
          JPG, PNG or WebP. Max {Math.round(maxSize / (1024 * 1024))}MB.
        </p>
      </div>

      {hasError && (
        <div id={errorId} className="mt-2" role="alert" aria-live="polite">
          <ErrorMessages id={errorId} errors={errors} />
        </div>
      )}
    </div>
  )
}
