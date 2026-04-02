import { usePrivy } from '@privy-io/react-auth'
import { renderHook } from '@testing-library/react'
import { useOAuthResult } from '~/components/Passkey/useOAuthResult'

vi.mock('@privy-io/react-auth', () => ({
  usePrivy: vi.fn(),
}))

vi.mock('~/components/Passkey/OAuthRedirectContext', () => ({
  useAssertOAuthRedirectRouter: vi.fn(),
}))

const TEST_KEY = 'test:oauthProvider'

describe('useOAuthResult', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    sessionStorage.clear()
  })

  it('returns idle state when no sessionStorage key is set', () => {
    vi.mocked(usePrivy).mockReturnValue({
      ready: true,
      authenticated: false,
      user: null,
    } as unknown as ReturnType<typeof usePrivy>)

    const { result } = renderHook(() => useOAuthResult(TEST_KEY))

    expect(result.current).toEqual({
      provider: null,
      providerEmail: undefined,
      pending: false,
    })
  })

  it('returns pending: true when key is set but Privy not yet authenticated', () => {
    sessionStorage.setItem(TEST_KEY, 'google')

    vi.mocked(usePrivy).mockReturnValue({
      ready: false,
      authenticated: false,
      user: null,
    } as unknown as ReturnType<typeof usePrivy>)

    const { result } = renderHook(() => useOAuthResult(TEST_KEY))

    expect(result.current.pending).toBe(true)
    expect(result.current.provider).toBeNull()
  })

  it('returns provider and email when key is set and Privy authenticated (Google)', () => {
    sessionStorage.setItem(TEST_KEY, 'google')

    vi.mocked(usePrivy).mockReturnValue({
      ready: true,
      authenticated: true,
      user: { google: { email: 'user@gmail.com' } },
    } as unknown as ReturnType<typeof usePrivy>)

    const { result } = renderHook(() => useOAuthResult(TEST_KEY))

    expect(result.current).toEqual({
      provider: 'google',
      providerEmail: 'user@gmail.com',
      pending: false,
    })
  })

  it('returns provider and email when key is set and Privy authenticated (Apple)', () => {
    sessionStorage.setItem(TEST_KEY, 'apple')

    vi.mocked(usePrivy).mockReturnValue({
      ready: true,
      authenticated: true,
      user: { apple: { email: 'user@icloud.com' } },
    } as unknown as ReturnType<typeof usePrivy>)

    const { result } = renderHook(() => useOAuthResult(TEST_KEY))

    expect(result.current).toEqual({
      provider: 'apple',
      providerEmail: 'user@icloud.com',
      pending: false,
    })
  })

  it('resets to initial state when provider is pending but account not linked', () => {
    sessionStorage.setItem(TEST_KEY, 'google')

    vi.mocked(usePrivy).mockReturnValue({
      ready: true,
      authenticated: true,
      user: { google: undefined },
    } as unknown as ReturnType<typeof usePrivy>)

    const { result } = renderHook(() => useOAuthResult(TEST_KEY))

    expect(result.current).toEqual({ provider: null, providerEmail: undefined, pending: false })
    expect(sessionStorage.getItem(TEST_KEY)).toBeNull()
  })

  it('clears sessionStorage after detection', () => {
    sessionStorage.setItem(TEST_KEY, 'google')

    vi.mocked(usePrivy).mockReturnValue({
      ready: true,
      authenticated: true,
      user: { google: { email: 'user@gmail.com' } },
    } as unknown as ReturnType<typeof usePrivy>)

    renderHook(() => useOAuthResult(TEST_KEY))

    expect(sessionStorage.getItem(TEST_KEY)).toBeNull()
  })
})
