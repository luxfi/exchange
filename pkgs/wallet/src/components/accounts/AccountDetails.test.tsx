import { AccountDetails } from '@luxfi/wallet/src/components/accounts/AccountDetails'
import { ACCOUNT } from '@luxfi/wallet/src/test/fixtures'
import { renderWithProviders } from '@luxfi/wallet/src/test/render'

describe(AccountDetails, () => {
  it('renders without error', () => {
    const tree = renderWithProviders(<AccountDetails address={ACCOUNT.address} />)

    expect(tree.toJSON()).toMatchSnapshot()
  })

  it('renders without error with chevron', () => {
    const tree = renderWithProviders(<AccountDetails chevron address={ACCOUNT.address} />)

    expect(tree.toJSON()).toMatchSnapshot()
  })
})
