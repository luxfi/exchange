import { UniverseChainId } from 'lx/src/features/chains/types'
import { AppNotificationType } from 'lx/src/features/notifications/slice/types'
import { NetworkChangedNotification } from 'wallet/src/features/notifications/components/NetworkChangedNotification'
import { renderWithProviders } from 'wallet/src/test/render'

// Mock the account store hooks
jest.mock('lx/src/features/accounts/store/hooks', () => ({
  useActiveAddress: jest.fn(() => undefined),
  useActiveAddresses: jest.fn(() => ({
    evmAddress: undefined,
    svmAddress: undefined,
  })),
}))

// Use the web implementation of NotificationToast for testing
jest.mock('lx/src/components/notifications/NotificationToast', () => {
  return jest.requireActual('lx/src/components/notifications/NotificationToast.web')
})

describe(NetworkChangedNotification, () => {
  it('renders with swap flow', () => {
    const { queryByText } = renderWithProviders(
      <NetworkChangedNotification
        notification={{
          type: AppNotificationType.NetworkChanged,
          chainId: UniverseChainId.Mainnet,
          flow: 'swap',
        }}
      />,
    )
    const title = queryByText('Swapping on Ethereum')
    expect(title).toBeTruthy()
  })

  it('renders with send flow', () => {
    const { queryByText } = renderWithProviders(
      <NetworkChangedNotification
        notification={{
          type: AppNotificationType.NetworkChanged,
          chainId: UniverseChainId.Mainnet,
          flow: 'send',
        }}
      />,
    )
    const title = queryByText('Sending on Ethereum')
    expect(title).toBeTruthy()
  })

  it('renders withoout flow', () => {
    const { queryByText } = renderWithProviders(
      <NetworkChangedNotification
        notification={{
          type: AppNotificationType.NetworkChanged,
          chainId: UniverseChainId.Mainnet,
        }}
      />,
    )
    const title = queryByText('Switched to Ethereum')
    expect(title).toBeTruthy()
  })
})
