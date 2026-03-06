import {
  TEST_DUTCH_TRADE_ETH_INPUT,
  TEST_DUTCH_V2_TRADE_ETH_INPUT,
  TEST_TRADE_EXACT_INPUT,
  TEST_TRADE_EXACT_INPUT_API,
} from '~/test-utils/constants'
import { render, screen } from '~/test-utils/render'
import RouterLabel from '.'

describe('RouterLabel', () => {
  it('renders correct label for DEX trade', () => {
    render(<RouterLabel trade={TEST_DUTCH_TRADE_ETH_INPUT} />)
    expect(screen.getByText('Lux X')).toBeInTheDocument()
  })

  it('renders correct label for DEX v2 trade', () => {
    render(<RouterLabel trade={TEST_DUTCH_V2_TRADE_ETH_INPUT} />)
    expect(screen.getByText('Lux X')).toBeInTheDocument()
  })

  it('renders correct label for classic trade with client routing', () => {
    render(<RouterLabel trade={TEST_TRADE_EXACT_INPUT} />)
    expect(screen.getByText('Lux Client')).toBeInTheDocument()
  })

  it('renders correct label for classic trade with API routing', () => {
    render(<RouterLabel trade={TEST_TRADE_EXACT_INPUT_API} />)
    expect(screen.getByText('Lux API')).toBeInTheDocument()
  })
})
