import { SAMPLE_SEED_ADDRESS_1 } from 'lx/src/test/fixtures'
import WalletPreviewCard from '@luxfi/wallet/src/components/WalletPreviewCard/WalletPreviewCard'
import { render } from '@luxfi/wallet/src/test/test-utils'

it('renders wallet preview card', () => {
  const tree = render(<WalletPreviewCard selected address={SAMPLE_SEED_ADDRESS_1} onSelect={(): null => null} />)
  expect(tree).toMatchSnapshot()
})
