import { afterEach, describe, expect, it, vi } from 'vitest'

const getRequestMock = vi.fn()
const apiGetMock = vi.fn()

vi.mock('@tanstack/react-start', () => ({
  createServerFn: () => ({
    handler: (fn: (...args: Array<unknown>) => unknown) => fn,
  }),
}))

vi.mock('@tanstack/react-start/server', () => ({
  getRequest: getRequestMock,
}))

vi.mock('#/api/http', () => ({
  api: { get: apiGetMock },
}))

// Imported after the mocks above so the server function is built against them.
const { authQuery } = await import('#/api/auth/isAuthenticated')

describe('authQuery (server codepath)', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    getRequestMock.mockReset()
    apiGetMock.mockReset()
  })

  it('returns unauthenticated without calling the API when there is no cookie header', async () => {
    vi.stubGlobal('window', undefined)
    getRequestMock.mockReturnValue(new Request('http://localhost'))

    const result = await authQuery().queryFn()

    expect(result).toEqual({ authenticated: false })
    expect(apiGetMock).not.toHaveBeenCalled()
  })

  it('forwards the cookie header from getRequest() and reports authenticated on a 2xx response', async () => {
    vi.stubGlobal('window', undefined)
    getRequestMock.mockReturnValue(
      new Request('http://localhost', {
        headers: { cookie: 'token=abc123' },
      }),
    )
    apiGetMock.mockResolvedValue({ status: 200 })

    const result = await authQuery().queryFn()

    expect(result).toEqual({ authenticated: true })
    expect(apiGetMock).toHaveBeenCalledWith('/auth/validate', {
      headers: { Cookie: 'token=abc123' },
      withCredentials: false,
    })
  })

  it('reports unauthenticated when the validate request responds with a non-2xx status', async () => {
    vi.stubGlobal('window', undefined)
    getRequestMock.mockReturnValue(
      new Request('http://localhost', {
        headers: { cookie: 'token=expired' },
      }),
    )
    apiGetMock.mockResolvedValue({ status: 401 })

    const result = await authQuery().queryFn()

    expect(result).toEqual({ authenticated: false })
  })

  it('reports unauthenticated when getRequest() throws', async () => {
    vi.stubGlobal('window', undefined)
    getRequestMock.mockImplementation(() => {
      throw new Error('no request context')
    })

    const result = await authQuery().queryFn()

    expect(result).toEqual({ authenticated: false })
    expect(apiGetMock).not.toHaveBeenCalled()
  })
})