<<<<<<< HEAD
=======
import RouterLabel from '.'
>>>>>>> upstream/main
import {
  TEST_DUTCH_TRADE_ETH_INPUT,
  TEST_DUTCH_V2_TRADE_ETH_INPUT,
  TEST_TRADE_EXACT_INPUT,
  TEST_TRADE_EXACT_INPUT_API,
} from '~/test-utils/constants'
import { render, screen } from '~/test-utils/render'
<<<<<<< HEAD
import RouterLabel from '.'

describe('RouterLabel', () => {
  it('renders correct label for DEX trade', () => {
    render(<RouterLabel trade={TEST_DUTCH_TRADE_ETH_INPUT} />)
    expect(screen.getByText('Lux X')).toBeInTheDocument()
  })

  it('renders correct label for DEX v2 trade', () => {
    render(<RouterLabel trade={TEST_DUTCH_V2_TRADE_ETH_INPUT} />)
    expect(screen.getByText('Lux X')).toBeInTheDocument()
=======

describe('RouterLabel', () => {
  it('renders correct label for UniswapX trade', () => {
    render(<RouterLabel trade={TEST_DUTCH_TRADE_ETH_INPUT} />)
    expect(screen.getByText('Uniswap X')).toBeInTheDocument()
  })

  it('renders correct label for UniswapX v2 trade', () => {
    render(<RouterLabel trade={TEST_DUTCH_V2_TRADE_ETH_INPUT} />)
    expect(screen.getByText('Uniswap X')).toBeInTheDocument()
>>>>>>> upstream/main
  })

  it('renders correct label for classic trade with client routing', () => {
    render(<RouterLabel trade={TEST_TRADE_EXACT_INPUT} />)
<<<<<<< HEAD
    expect(screen.getByText('Lux Client')).toBeInTheDocument()
=======
    expect(screen.getByText('Uniswap Client')).toBeInTheDocument()
>>>>>>> upstream/main
  })

  it('renders correct label for classic trade with API routing', () => {
    render(<RouterLabel trade={TEST_TRADE_EXACT_INPUT_API} />)
<<<<<<< HEAD
    expect(screen.getByText('Lux API')).toBeInTheDocument()
=======
    expect(screen.getByText('Uniswap API')).toBeInTheDocument()
>>>>>>> upstream/main
  })
})
