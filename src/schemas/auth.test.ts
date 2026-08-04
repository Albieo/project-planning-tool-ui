import { describe, expect, it } from 'vitest'
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  resetPasswordSearchSchema,
} from '#/schemas/auth'

describe('forgotPasswordSchema', () => {
  it('accepts a valid email', () => {
    expect(forgotPasswordSchema.parse({ email: 'user@example.com' })).toEqual(
      { email: 'user@example.com' },
    )
  })

  it('rejects an invalid email', () => {
    const result = forgotPasswordSchema.safeParse({ email: 'not-an-email' })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        'Please enter a valid email address',
      )
    }
  })

  it('rejects a missing email', () => {
    const result = forgotPasswordSchema.safeParse({})

    expect(result.success).toBe(false)
  })
})

describe('resetPasswordSchema', () => {
  it('accepts matching passwords of sufficient length', () => {
    const result = resetPasswordSchema.parse({
      password: 'longenough1',
      confirmPassword: 'longenough1',
    })

    expect(result).toEqual({
      password: 'longenough1',
      confirmPassword: 'longenough1',
    })
  })

  it('rejects mismatched passwords', () => {
    const result = resetPasswordSchema.safeParse({
      password: 'longenough1',
      confirmPassword: 'different1',
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(['confirmPassword'])
      expect(result.error.issues[0].message).toBe('Passwords do not match')
    }
  })

  it('rejects passwords shorter than 8 characters', () => {
    const result = resetPasswordSchema.safeParse({
      password: 'short',
      confirmPassword: 'short',
    })

    expect(result.success).toBe(false)
  })

  it('rejects when confirmPassword is missing', () => {
    const result = resetPasswordSchema.safeParse({
      password: 'longenough1',
    })

    expect(result.success).toBe(false)
  })
})

describe('resetPasswordSearchSchema', () => {
  it('accepts an object with a token', () => {
    expect(resetPasswordSearchSchema.parse({ token: 'abc123' })).toEqual({
      token: 'abc123',
    })
  })

  it('accepts an object without a token since it is optional', () => {
    expect(resetPasswordSearchSchema.parse({})).toEqual({})
  })

  it('rejects a non-string token', () => {
    const result = resetPasswordSearchSchema.safeParse({ token: 123 })

    expect(result.success).toBe(false)
  })
})