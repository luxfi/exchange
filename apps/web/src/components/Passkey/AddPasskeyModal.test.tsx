import { fireEvent } from '@testing-library/react'
import {
  authenticateWithPasskey,
  getPrivyEnums,
  registerNewAuthenticator,
} from 'uniswap/src/features/passkey/embeddedWallet'
import { ModalName } from 'uniswap/src/features/telemetry/constants'
import { AddPasskeyModal } from '~/components/Passkey/AddPasskeyModal'
import { useModalState } from '~/hooks/useModalState'
import { usePasskeyAuthWithHelpModal } from '~/hooks/usePasskeyAuthWithHelpModal'
import { useEmbeddedWalletState } from '~/state/embeddedWallet/store'
import { render, screen } from '~/test-utils/render'

vi.mock('uniswap/src/features/passkey/embeddedWallet', () => ({
  authenticateWithPasskey: vi.fn(),
  getPrivyEnums: vi.fn(),
  registerNewAuthenticator: vi.fn(),
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

vi.mock('uniswap/src/data/apiClients/unitagsApi/useUnitagsAddressQuery', () => ({
  useUnitagsAddressQuery: vi.fn(() => ({ data: undefined, isLoading: false })),
}))

vi.mock('~/hooks/useAccount', () => ({
  useAccount: vi.fn(() => ({ address: '0xabc' })),
}))

const mockOnClose = vi.fn()
const mockVerifyPasskey = vi.fn()
const mockRegisterAuthenticator = vi.fn()

function setupMocks() {
  vi.mocked(useModalState).mockReturnValue({ isOpen: true, onClose: mockOnClose } as unknown as ReturnType<
    typeof useModalState
  >)
  vi.mocked(useEmbeddedWalletState).mockReturnValue({ walletId: 'wallet-id' } as ReturnType<
    typeof useEmbeddedWalletState
  >)

  vi.mocked(usePasskeyAuthWithHelpModal)
    .mockReturnValueOnce({ mutate: mockVerifyPasskey } as unknown as ReturnType<typeof usePasskeyAuthWithHelpModal>)
    .mockReturnValueOnce({ mutate: mockRegisterAuthenticator } as unknown as ReturnType<
      typeof usePasskeyAuthWithHelpModal
    >)
}

describe('AddPasskeyModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders verify step by default', () => {
    setupMocks()
    render(<AddPasskeyModal />)
    expect(screen.getByText('Passkey required')).toBeInTheDocument()
    expect(screen.getByText('Sign in with passkey')).toBeInTheDocument()
  })

  it('calls verifyPasskey when Sign in button is pressed', () => {
    setupMocks()
    render(<AddPasskeyModal />)
    fireEvent.click(screen.getByText('Sign in with passkey'))
    expect(mockVerifyPasskey).toHaveBeenCalledTimes(1)
  })

  it('renders snapshot at verify step', () => {
    setupMocks()
    render(<AddPasskeyModal />)
    expect(document.body).toMatchSnapshot()
  })
})
