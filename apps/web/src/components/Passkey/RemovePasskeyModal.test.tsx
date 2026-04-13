import { fireEvent } from '@testing-library/react'
import {
  authenticateWithPasskey,
  deleteAuthenticator,
  disconnectWallet,
  getPrivyEnums,
} from 'uniswap/src/features/passkey/embeddedWallet'
import { ModalName } from 'uniswap/src/features/telemetry/constants'
import { useAccountDrawer } from '~/components/AccountDrawer/MiniPortfolio/hooks'
import { RemovePasskeyModal } from '~/components/Passkey/RemovePasskeyModal'
import { useDisconnect } from '~/hooks/useDisconnect'
import { useModalState } from '~/hooks/useModalState'
import { usePasskeyAuthWithHelpModal } from '~/hooks/usePasskeyAuthWithHelpModal'
import { useEmbeddedWalletState } from '~/state/embeddedWallet/store'
import { useAppSelector } from '~/state/hooks'
import { render, screen } from '~/test-utils/render'

vi.mock('uniswap/src/features/passkey/embeddedWallet', () => ({
  authenticateWithPasskey: vi.fn(),
  deleteAuthenticator: vi.fn(),
  disconnectWallet: vi.fn(),
  getPrivyEnums: vi.fn(),
}))

vi.mock('~/hooks/usePasskeyAuthWithHelpModal', () => ({
  usePasskeyAuthWithHelpModal: vi.fn(),
}))

vi.mock('~/hooks/useModalState', () => ({
  useModalState: vi.fn(),
}))

vi.mock('~/state/embeddedWallet/store', async (importOriginal) => ({
  ...(await importOriginal<typeof import('~/state/embeddedWallet/store')>()),
  useEmbeddedWalletState: vi.fn(),
}))

vi.mock('~/state/hooks', () => ({
  useAppSelector: vi.fn(),
  useAppDispatch: vi.fn(() => vi.fn()),
}))

vi.mock('~/hooks/useDisconnect', () => ({
  useDisconnect: vi.fn(),
}))

vi.mock('~/components/AccountDrawer/MiniPortfolio/hooks', () => ({
  useAccountDrawer: vi.fn(),
}))

vi.mock('uniswap/src/features/accounts/store/hooks', () => ({
  useActiveAddress: vi.fn(() => '0xabc'),
}))

vi.mock('uniswap/src/features/dataApi/balances/balancesRest', () => ({
  usePortfolioTotalValue: vi.fn(() => ({ data: { balanceUSD: 100 } })),
}))

vi.mock('uniswap/src/features/language/LocalizationContext', () => ({
  useLocalizationContext: vi.fn(() => ({
    convertFiatAmountFormatted: vi.fn((value: unknown) => String(value)),
  })),
}))

const mockOnClose = vi.fn()
const mockVerify = vi.fn()
const mockDelete = vi.fn()
const mockDisconnect = vi.fn()
const mockDrawerClose = vi.fn()

const MOCK_INITIAL_STATE = {
  authenticatorId: 'cred-123',
  authenticatorLabel: 'iCloud',
  authenticatorProviderName: 'iCloud',
  isLastAuthenticator: false,
}

function setupMocks(initialState = MOCK_INITIAL_STATE) {
  vi.mocked(useModalState).mockReturnValue({ isOpen: true, onClose: mockOnClose } as unknown as ReturnType<
    typeof useModalState
  >)
  vi.mocked(useEmbeddedWalletState).mockReturnValue({ walletId: 'wallet-id' } as ReturnType<
    typeof useEmbeddedWalletState
  >)
  vi.mocked(useAppSelector).mockReturnValue({ initialState })
  vi.mocked(useDisconnect).mockReturnValue(mockDisconnect)
  vi.mocked(useAccountDrawer).mockReturnValue({ close: mockDrawerClose } as unknown as ReturnType<
    typeof useAccountDrawer
  >)

  vi.mocked(usePasskeyAuthWithHelpModal)
    .mockReturnValueOnce({ mutate: mockVerify } as unknown as ReturnType<typeof usePasskeyAuthWithHelpModal>)
    .mockReturnValueOnce({ mutate: mockDelete } as unknown as ReturnType<typeof usePasskeyAuthWithHelpModal>)
}

describe('RemovePasskeyModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders verify step by default', () => {
    setupMocks()
    render(<RemovePasskeyModal />)
    expect(screen.getByText('Passkey required')).toBeInTheDocument()
    expect(screen.queryByText('Are you sure?')).not.toBeInTheDocument()
  })

  it('calls verifyPasskey when Sign in button is pressed', () => {
    setupMocks()
    render(<RemovePasskeyModal />)
    fireEvent.click(screen.getByText('Sign in with passkey'))
    expect(mockVerify).toHaveBeenCalledTimes(1)
  })

  it('renders snapshot at verify step', () => {
    setupMocks()
    render(<RemovePasskeyModal />)
    expect(document.body).toMatchSnapshot()
  })
})
