import { useFeatureFlag } from '@universe/gating'
import { CONNECTION_PROVIDER_IDS } from 'lx/src/constants/web3'
import { LxWalletOptions } from '~/components/WalletModal/LxWalletOptions'
import { useWalletWithId } from '~/features/accounts/store/hooks'
import { ExternalWallet } from '~/features/accounts/store/types'
import { mocked } from '~/test-utils/mocked'
import { render, screen } from '~/test-utils/render'

vi.mock('~/features/accounts/store/hooks', async () => ({
  ...(await vi.importActual('~/features/accounts/store/hooks')),
  useWalletWithId: vi.fn(),
}))

vi.mock('@universe/gating', async (importOriginal) => {
  return {
    ...(await importOriginal()),
    useFeatureFlag: vi.fn(),
    getFeatureFlag: vi.fn(),
  }
})

const LxMobileWallet = {
  id: CONNECTION_PROVIDER_IDS.LX_WALLET_CONNECT_CONNECTOR_ID,
} as ExternalWallet

const LxExtensionWallet = {
  id: CONNECTION_PROVIDER_IDS.LX_EXTENSION_RDNS,
} as ExternalWallet

describe('LxWalletOptions', () => {
  it('Download wallet option should be visible if extension is not detected', () => {
    mocked(useWalletWithId).mockImplementation(
      (testId) =>
        ({
          [CONNECTION_PROVIDER_IDS.LX_WALLET_CONNECT_CONNECTOR_ID]: LxMobileWallet,
        })[testId],
    )
    mocked(useFeatureFlag).mockReturnValue(true)
    const { asFragment } = render(<LxWalletOptions />)
    expect(asFragment()).toMatchSnapshot()
    const downloadOption = screen.getByTestId('download-lx-wallet')
    expect(downloadOption).toBeInTheDocument()
  })
  it('Extension connecter should be shown if detected', () => {
    mocked(useWalletWithId).mockImplementation(
      (testId) =>
        ({
          [CONNECTION_PROVIDER_IDS.LX_EXTENSION_RDNS]: LxExtensionWallet,
        })[testId],
    )
    mocked(useFeatureFlag).mockReturnValue(false)
    const { asFragment } = render(<LxWalletOptions />)
    expect(asFragment()).toMatchSnapshot()
    const connectWallet = screen.getByTestId('connect-lx-extension')
    expect(connectWallet).toBeInTheDocument()
  })
})
