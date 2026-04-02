import { useFeatureFlag } from '@luxexchange/gating'
import { CONNECTION_PROVIDER_IDS } from '@luxexchange/lx/src/constants/web3'
import { LuxWalletOptions } from '~/components/WalletModal/LuxWalletOptions'
import { useWalletWithId } from '~/features/accounts/store/hooks'
import { ExternalWallet } from '~/features/accounts/store/types'
import { mocked } from '~/test-utils/mocked'
import { render, screen } from '~/test-utils/render'

vi.mock('~/features/accounts/store/hooks', async () => ({
  ...(await vi.importActual('~/features/accounts/store/hooks')),
  useWalletWithId: vi.fn(),
}))

vi.mock('@luxexchange/gating', async (importOriginal) => {
  return {
    ...(await importOriginal()),
    useFeatureFlag: vi.fn(),
    getFeatureFlag: vi.fn(),
  }
})

const LuxMobileWallet = {
  id: CONNECTION_PROVIDER_IDS.LUX_WALLET_CONNECT_CONNECTOR_ID,
} as ExternalWallet

const LuxExtensionWallet = {
  id: CONNECTION_PROVIDER_IDS.LUX_EXTENSION_RDNS,
} as ExternalWallet

describe('LuxWalletOptions', () => {
  it('Download wallet option should be visible if extension is not detected', () => {
    mocked(useWalletWithId).mockImplementation(
      (testId) =>
        ({
          [CONNECTION_PROVIDER_IDS.LUX_WALLET_CONNECT_CONNECTOR_ID]: LuxMobileWallet,
        })[testId],
    )
    mocked(useFeatureFlag).mockReturnValue(true)
    const { asFragment } = render(<LuxWalletOptions />)
    expect(asFragment()).toMatchSnapshot()
    const downloadOption = screen.getByTestId('download-lux-wallet')
    expect(downloadOption).toBeInTheDocument()
  })
  it('Extension connecter should be shown if detected', () => {
    mocked(useWalletWithId).mockImplementation(
      (testId) =>
        ({
          [CONNECTION_PROVIDER_IDS.LUX_EXTENSION_RDNS]: LuxExtensionWallet,
        })[testId],
    )
    mocked(useFeatureFlag).mockReturnValue(false)
    const { asFragment } = render(<LuxWalletOptions />)
    expect(asFragment()).toMatchSnapshot()
    const connectWallet = screen.getByTestId('connect-lux-extension')
    expect(connectWallet).toBeInTheDocument()
  })
})
