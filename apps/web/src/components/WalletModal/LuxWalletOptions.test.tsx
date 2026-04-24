import { useFeatureFlag } from '@l.x/gating'
import { CONNECTION_PROVIDER_IDS } from '@l.x/lx/src/constants/web3'
import { LXWalletOptions } from '~/components/WalletModal/LXWalletOptions'
import { useWalletWithId } from '~/features/accounts/store/hooks'
import { ExternalWallet } from '~/features/accounts/store/types'
import { mocked } from '~/test-utils/mocked'
import { render, screen } from '~/test-utils/render'

vi.mock('~/features/accounts/store/hooks', async () => ({
  ...(await vi.importActual('~/features/accounts/store/hooks')),
  useWalletWithId: vi.fn(),
}))

vi.mock('@l.x/gating', async (importOriginal) => {
  return {
    ...(await importOriginal()),
    useFeatureFlag: vi.fn(),
    getFeatureFlag: vi.fn(),
  }
})

const LXMobileWallet = {
  id: CONNECTION_PROVIDER_IDS.LX_WALLET_CONNECT_CONNECTOR_ID,
} as ExternalWallet

const LXExtensionWallet = {
  id: CONNECTION_PROVIDER_IDS.LX_EXTENSION_RDNS,
} as ExternalWallet

describe('LXWalletOptions', () => {
  it('Download wallet option should be visible if extension is not detected', () => {
    mocked(useWalletWithId).mockImplementation(
      (testId) =>
        ({
          [CONNECTION_PROVIDER_IDS.LX_WALLET_CONNECT_CONNECTOR_ID]: LXMobileWallet,
        })[testId],
    )
    mocked(useFeatureFlag).mockReturnValue(true)
    const { asFragment } = render(<LXWalletOptions />)
    expect(asFragment()).toMatchSnapshot()
    const downloadOption = screen.getByTestId('download-lx-wallet')
    expect(downloadOption).toBeInTheDocument()
  })
  it('Extension connecter should be shown if detected', () => {
    mocked(useWalletWithId).mockImplementation(
      (testId) =>
        ({
          [CONNECTION_PROVIDER_IDS.LX_EXTENSION_RDNS]: LXExtensionWallet,
        })[testId],
    )
    mocked(useFeatureFlag).mockReturnValue(false)
    const { asFragment } = render(<LXWalletOptions />)
    expect(asFragment()).toMatchSnapshot()
    const connectWallet = screen.getByTestId('connect-lx-extension')
    expect(connectWallet).toBeInTheDocument()
  })
})
