import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/components/ui/card'
import { Field, FieldGroup } from '#/components/ui/field'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import { useAppForm } from '#/hooks/form'
import { profileSchema } from '#/schemas/profile'
import { getInitials } from '#/lib/get-initials'
import { useEffect, useRef, useState } from 'react'
import type { ProfileResponse } from '#/lib/interfaces/profile-response.interface'
import type { UpdateProfilePayload } from '#/lib/interfaces/update-profile-payload.interface'
import { useDeleteProfile } from '#/api/auth/delete-profile.auth'
import { resolveBackendUrl } from '#/api/http'

type ProfileFormProps = {
  profile: ProfileResponse
  onSubmit: (data: UpdateProfilePayload) => Promise<void>
  isLoading?: boolean
}

export function ProfileForm({
  profile,
  onSubmit,
  isLoading,
}: Readonly<ProfileFormProps>) {
  const form = useAppForm({
    defaultValues: {
      name: profile.name,
      username: profile.username,
      email: profile.email,
      avatar: null as File | null,
    },
    validators: {
      onSubmit: profileSchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value)
      setIsEditing(false)
    },
  })

  const initials = getInitials(profile.name)
  const [isEditing, setIsEditing] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    resolveBackendUrl(profile.profilePhotoUrl) ?? null,
  )
  const { mutate: deleteProfile, isPending: isDeleting } = useDeleteProfile()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const avatarFile = form.state.values.avatar

  useEffect(() => {
    if (!avatarFile) {
      setPreviewUrl(resolveBackendUrl(profile.profilePhotoUrl) ?? null)
      return
    }

    const objectUrl = URL.createObjectURL(avatarFile)
    setPreviewUrl(objectUrl)

    return () => {
      URL.revokeObjectURL(objectUrl)
    }
  }, [avatarFile, profile.profilePhotoUrl])

  const handleDeleteProfile = () => {
    const confirmed = window.confirm(
      'Delete your account? This cannot be undone.',
    )

    if (confirmed) {
      deleteProfile()
    }
  }

  return (
    <Card className="max-w-4xl w-full">
      <CardHeader>
        <CardTitle>Your Profile</CardTitle>
        <CardDescription>Update your personal information</CardDescription>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex flex-col items-center gap-4 w-full md:w-auto">
              <Avatar className="h-40 w-40">
                <AvatarImage src={previewUrl ?? undefined} />
                <AvatarFallback>{initials || 'NA'}</AvatarFallback>
              </Avatar>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                aria-label="Upload profile photo"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null
                  form.setFieldValue('avatar', file)
                }}
                disabled={!isEditing}
              />

              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!isEditing}
                onClick={() => fileInputRef.current?.click()}
              >
                Change Photo
              </Button>
            </div>

            {/* Form Fields */}
            <div className="flex-1 w-full">
              <FieldGroup>
                <Field>
                  <form.AppField name="name">
                    {(field) => (
                      <field.TextField
                        label="Full Name"
                        placeholder="John Doe"
                        autoComplete="name"
                        readOnly={!isEditing}
                      />
                    )}
                  </form.AppField>
                </Field>

                <Field>
                  <form.AppField name="username">
                    {(field) => (
                      <field.TextField
                        label="Username"
                        placeholder="@johndoe"
                        autoComplete="username"
                        readOnly={!isEditing}
                      />
                    )}
                  </form.AppField>
                </Field>

                <Field>
                  <form.AppField name="email">
                    {(field) => (
                      <field.TextField
                        label="Email"
                        type="email"
                        autoComplete="email"
                        placeholder="john@example.com"
                        readOnly={!isEditing}
                      />
                    )}
                  </form.AppField>
                </Field>

                <Field>
                  <form.AppForm>
                    {isEditing && (
                      <div className="grid grid-flow-col-dense grid-cols-1 md:grid-cols-2 w-full gap-4">
                        <form.SubscribeButton
                          label={isLoading ? 'Saving...' : 'Save Changes'}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            form.reset()
                            setIsEditing(false)
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    )}

                    {!isEditing && (
                      <div className="grid grid-flow-col-dense grid-cols-1 md:grid-cols-2 w-full gap-4">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={isDeleting}
                          onClick={() => setIsEditing(true)}
                        >
                          Edit Profile
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          disabled={isDeleting}
                          onClick={handleDeleteProfile}
                        >
                          {isDeleting ? 'Deleting...' : 'Delete Account'}
                        </Button>
                      </div>
                    )}
                  </form.AppForm>
                </Field>
              </FieldGroup>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
