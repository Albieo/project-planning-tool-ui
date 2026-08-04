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

vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
}))

// Imported after the mocks above so the server function is built against them.
const { getProfile } = await import('#/api/auth/get-profile.auth')

describe('getProfile (server codepath)', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    getRequestMock.mockReset()
    apiGetMock.mockReset()
  })

  it('forwards the cookie header from getRequest() to the profile request', async () => {
    vi.stubGlobal('window', undefined)
    getRequestMock.mockReturnValue(
      new Request('http://localhost', {
        headers: { cookie: 'session=xyz' },
      }),
    )
    apiGetMock.mockResolvedValue({
      status: 200,
      data: { name: 'Jane Doe', username: 'janedoe', email: 'jane@example.com' },
    })

    const result = await getProfile()

    expect(result).toEqual({
      name: 'Jane Doe',
      username: 'janedoe',
      email: 'jane@example.com',
    })
    expect(apiGetMock).toHaveBeenCalledWith('/auth/profile', {
      headers: { Cookie: 'session=xyz' },
      withCredentials: false,
    })
  })

  it('omits the headers option when there is no cookie header', async () => {
    vi.stubGlobal('window', undefined)
    getRequestMock.mockReturnValue(new Request('http://localhost'))
    apiGetMock.mockResolvedValue({
      status: 200,
      data: { name: 'Jane Doe', username: 'janedoe', email: 'jane@example.com' },
    })

    await getProfile()

    expect(apiGetMock).toHaveBeenCalledWith('/auth/profile', {
      headers: undefined,
      withCredentials: false,
    })
  })

  it('throws when the profile request responds with an error status', async () => {
    vi.stubGlobal('window', undefined)
    getRequestMock.mockReturnValue(
      new Request('http://localhost', {
        headers: { cookie: 'session=xyz' },
      }),
    )
    apiGetMock.mockResolvedValue({ status: 500, data: undefined })

    await expect(getProfile()).rejects.toThrow('Failed to fetch profile')
  })
})