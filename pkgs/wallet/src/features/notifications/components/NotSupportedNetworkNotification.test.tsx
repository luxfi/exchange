import { AppNotificationType } from 'lx/src/features/notifications/slice/types'
import { NotSupportedNetworkNotification } from '@luxfi/wallet/src/features/notifications/components/NotSupportedNetworkNotification'
import { renderWithProviders } from '@luxfi/wallet/src/test/render'

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

describe(NotSupportedNetworkNotification, () => {
  it('renders without error', () => {
    const tree = renderWithProviders(
      <NotSupportedNetworkNotification notification={{ type: AppNotificationType.NotSupportedNetwork }} />,
    )

    expect(tree).toMatchSnapshot()
  })
})
