import { z } from "zod"

const MAX_FILE_SIZE = 1024 * 1024 * 5; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const profileSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .regex(
      /^[a-zA-Z0-9._-]+$/,
      'Username can only contain letters, numbers, dots, underscores, and hyphens',
    ),
  email: z.email('Please enter a valid email address'),
  avatar: z.instanceof(File)
    .nullable()
    .refine((file) => {
      if (!file) return true
      return file.size <= MAX_FILE_SIZE
    }, `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`)
    .refine((file) => {
      if (!file) return true
      return ACCEPTED_IMAGE_TYPES.includes(file.type)
    }, 'Invalid file type. Only JPG, PNG, and WEBP are allowed.'),
})

export type ProfileFormValues = z.infer<typeof profileSchema>