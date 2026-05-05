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
import { useEffect, useState } from 'react'

type Profile = {
  name: string
  username: string
  email: string
  profilePhotoUrl?: string | null
}

type ProfileFormProps = {
  profile: Profile
  onSubmit: (data: {
    name: string
    username: string
    email: string
    avatar: File | null
  }) => Promise<void>
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
    },
  })

  const initials = getInitials(profile.name ?? '')
  const [editEnabled, setEditEnabled] = useState(true)
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    profile.profilePhotoUrl ?? null,
  )

  const avatarFile = form.state.values.avatar

  useEffect(() => {
    if (!avatarFile) {
      setPreviewUrl(profile.profilePhotoUrl ?? null)
      return
    }

    const objectUrl = URL.createObjectURL(avatarFile)
    setPreviewUrl(objectUrl)

    return () => {
      URL.revokeObjectURL(objectUrl)
    }
  }, [avatarFile, profile.profilePhotoUrl])

  return (
    <Card className="max-w-4xl w-full">
      <CardHeader>
        <CardTitle>Your Profile</CardTitle>
        <CardDescription>
          Update your personal information
        </CardDescription>
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
                type="file"
                id="avatar-upload"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null
                  form.setFieldValue('avatar', file)
                }}
                disabled={editEnabled}
              />

              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={editEnabled}
                onClick={() =>
                  document.getElementById('avatar-upload')?.click()
                }
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
                        readOnly={editEnabled}
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
                        readOnly={editEnabled}
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
                        readOnly={editEnabled}
                      />
                    )}
                  </form.AppField>
                </Field>

                <Field>
                  <form.AppForm>
                    {!editEnabled && (
                      <div className='grid grid-flow-col-dense grid-cols-1 md:grid-cols-2 w-full gap-4'>
                        <form.SubscribeButton
                          label={isLoading ? 'Saving...' : 'Save Changes'}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            form.reset()
                            setEditEnabled(true)
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    )}

                    {editEnabled && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setEditEnabled(false)}
                      >
                        Edit Profile
                      </Button>
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
