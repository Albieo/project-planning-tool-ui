import { afterEach, describe, expect, it, vi } from 'vitest'
import { resolveBackendUrl } from '#/api/http'

describe('resolveBackendUrl', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns undefined for a null path', () => {
    expect(resolveBackendUrl(null)).toBeUndefined()
  })

  it('returns undefined for an undefined path', () => {
    expect(resolveBackendUrl(undefined)).toBeUndefined()
  })

  it('returns undefined for an empty string path', () => {
    expect(resolveBackendUrl('')).toBeUndefined()
  })

  it('returns http urls unchanged', () => {
    expect(resolveBackendUrl('http://example.com/a.png')).toBe(
      'http://example.com/a.png',
    )
  })

  it('returns https urls unchanged', () => {
    expect(resolveBackendUrl('https://example.com/a.png')).toBe(
      'https://example.com/a.png',
    )
  })

  it('matches http(s) urls case-insensitively', () => {
    expect(resolveBackendUrl('HTTPS://Example.com/a.png')).toBe(
      'HTTPS://Example.com/a.png',
    )
  })

  it('returns blob urls unchanged', () => {
    const blobUrl = 'blob:http://localhost/1234-5678'
    expect(resolveBackendUrl(blobUrl)).toBe(blobUrl)
  })

  it('returns data urls unchanged', () => {
    const dataUrl = 'data:image/png;base64,aGVsbG8='
    expect(resolveBackendUrl(dataUrl)).toBe(dataUrl)
  })

  it('returns undefined for protocol-relative urls', () => {
    expect(resolveBackendUrl('//example.com/a.png')).toBeUndefined()
  })

  it('resolves a relative path against the configured backend url', () => {
    const result = resolveBackendUrl('/uploads/avatar.png')

    expect(result).toBeDefined()
    expect(new URL(result as string).pathname).toBe('/uploads/avatar.png')
  })

  it('resolves a relative path without a leading slash', () => {
    const result = resolveBackendUrl('uploads/avatar.png')

    expect(result).toBeDefined()
    expect(new URL(result as string).pathname).toBe('/uploads/avatar.png')
  })

  it('returns undefined when URL construction throws', () => {
    class ThrowingURL {
      constructor() {
        throw new Error('invalid url')
      }
    }

    vi.stubGlobal('URL', ThrowingURL as unknown as typeof URL)

    expect(resolveBackendUrl('/uploads/avatar.png')).toBeUndefined()
  })
})