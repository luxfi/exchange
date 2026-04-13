import { renderHook } from '@testing-library/react'
import { useDispatch } from 'react-redux'
import { ModalName } from 'uniswap/src/features/telemetry/constants'
import { MenuStateVariant, useSetMenu } from '~/components/AccountDrawer/menuState'
import { useAccountDrawer } from '~/components/AccountDrawer/MiniPortfolio/hooks'
import { useOAuthRedirectRouter } from '~/components/Passkey/useOAuthRedirectRouter'
import { setOpenModal } from '~/state/application/reducer'

vi.mock('react-redux', () => ({
  useDispatch: vi.fn(),
}))

vi.mock('~/components/AccountDrawer/MiniPortfolio/hooks', () => ({
  useAccountDrawer: vi.fn(),
}))

vi.mock('~/components/AccountDrawer/menuState', () => ({
  useSetMenu: vi.fn(),
  MenuStateVariant: { PASSKEYS: 'PASSKEYS' },
}))

vi.mock('~/state/application/reducer', () => ({
  setOpenModal: vi.fn((arg: unknown) => ({ type: 'SET_OPEN_MODAL', payload: arg })),
}))

const mockDispatch = vi.fn()
const mockOpen = vi.fn()
const mockSetMenu = vi.fn()

function setupMocks() {
  vi.mocked(useDispatch).mockReturnValue(mockDispatch)
  vi.mocked(useAccountDrawer).mockReturnValue({ open: mockOpen } as unknown as ReturnType<typeof useAccountDrawer>)
  vi.mocked(useSetMenu).mockReturnValue(mockSetMenu)
}

describe('useOAuthRedirectRouter', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    sessionStorage.clear()

    // Reset window.location.search
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { ...window.location, search: '' },
    })
  })

  it('does nothing when no pending provider in sessionStorage', () => {
    setupMocks()
    renderHook(() => useOAuthRedirectRouter())

    expect(mockOpen).not.toHaveBeenCalled()
    expect(mockSetMenu).not.toHaveBeenCalled()
    expect(mockDispatch).not.toHaveBeenCalled()
  })

  it('does nothing when pending provider exists but no privy_oauth_code param', () => {
    sessionStorage.setItem('addBackupLogin:oauthProvider', 'google')
    setupMocks()
    renderHook(() => useOAuthRedirectRouter())

    expect(mockOpen).not.toHaveBeenCalled()
    expect(mockSetMenu).not.toHaveBeenCalled()
    expect(mockDispatch).not.toHaveBeenCalled()
  })

  it('does nothing when privy_oauth_code exists but no pending provider', () => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { ...window.location, search: '?privy_oauth_code=abc123' },
    })
    setupMocks()
    renderHook(() => useOAuthRedirectRouter())

    expect(mockOpen).not.toHaveBeenCalled()
    expect(mockSetMenu).not.toHaveBeenCalled()
    expect(mockDispatch).not.toHaveBeenCalled()
  })

  it('opens drawer, sets menu, and dispatches AddBackupLogin modal when add-backup key is set', () => {
    sessionStorage.setItem('addBackupLogin:oauthProvider', 'google')
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { ...window.location, search: '?privy_oauth_code=abc123' },
    })
    setupMocks()
    renderHook(() => useOAuthRedirectRouter())

    expect(mockOpen).toHaveBeenCalled()
    expect(mockSetMenu).toHaveBeenCalledWith({ variant: MenuStateVariant.PASSKEYS })
    expect(mockDispatch).toHaveBeenCalledWith(setOpenModal({ name: ModalName.AddBackupLogin }))
  })

  it('dispatches RecoverWallet modal without opening drawer when recover key is set', () => {
    sessionStorage.setItem('recoverWallet:oauthProvider', 'google')
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { ...window.location, search: '?privy_oauth_code=abc123' },
    })
    setupMocks()
    renderHook(() => useOAuthRedirectRouter())

    expect(mockOpen).not.toHaveBeenCalled()
    expect(mockSetMenu).not.toHaveBeenCalled()
    expect(mockDispatch).toHaveBeenCalledWith(setOpenModal({ name: ModalName.RecoverWallet }))
  })

  it('does nothing when recover key is set but no privy_oauth_code param', () => {
    sessionStorage.setItem('recoverWallet:oauthProvider', 'apple')
    setupMocks()
    renderHook(() => useOAuthRedirectRouter())

    expect(mockOpen).not.toHaveBeenCalled()
    expect(mockSetMenu).not.toHaveBeenCalled()
    expect(mockDispatch).not.toHaveBeenCalled()
  })

  it('prefers add-backup key when both keys are set', () => {
    sessionStorage.setItem('addBackupLogin:oauthProvider', 'google')
    sessionStorage.setItem('recoverWallet:oauthProvider', 'apple')
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { ...window.location, search: '?privy_oauth_code=abc123' },
    })
    setupMocks()
    renderHook(() => useOAuthRedirectRouter())

    expect(mockDispatch).toHaveBeenCalledWith(setOpenModal({ name: ModalName.AddBackupLogin }))
  })
})
