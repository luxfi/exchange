import ReactDOM from 'react-dom'
import { NetworkFilter } from 'lx/src/components/network/NetworkFilter'
import { ALL_CHAIN_IDS } from 'lx/src/features/chains/chainInfo'
import { renderWithProviders } from 'lx/src/test/render'
import { act } from 'lx/src/test/test-utils'

ReactDOM.createPortal = vi.fn((element) => {
  return element as React.ReactPortal
})

describe(NetworkFilter, () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders a NetworkFilter', async () => {
    const tree = renderWithProviders(
      <NetworkFilter chainIds={ALL_CHAIN_IDS} selectedChain={null} onPressChain={() => null} />,
    )

    await act(async () => {
      vi.runAllTimers()
    })

    expect(tree).toMatchSnapshot()
  })
})
