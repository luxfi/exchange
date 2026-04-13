import '~/test-utils/tokens/mocks'
import SwapLineItem, { SwapLineItemType } from '~/components/swap/SwapLineItem'
import { InterfaceTrade } from '~/state/routing/types'
import {
  LIMIT_ORDER_TRADE,
  PREVIEW_EXACT_IN_TRADE,
  TEST_ALLOWED_SLIPPAGE,
  TEST_DUTCH_TRADE_ETH_INPUT,
  TEST_DUTCH_V2_TRADE_ETH_INPUT,
  TEST_TRADE_EXACT_INPUT,
  TEST_TRADE_EXACT_INPUT_API,
  TEST_TRADE_EXACT_OUTPUT,
  TEST_TRADE_FEE_ON_BUY,
  TEST_TRADE_FEE_ON_SELL,
} from '~/test-utils/constants'
import { render, screen } from '~/test-utils/render'

// Forces tooltips to render in snapshots
vi.mock('react-dom', () => {
  const original = vi.importActual('react-dom')
  return {
    ...original,
    createPortal: (node: any) => node,
  }
})

// Prevents uuid from generating unpredictable values in snapshots
vi.mock('uuid', () => ({
  v4: () => 'fixed-uuid-value',
}))

const AllLineItemsTypes = Object.keys(SwapLineItemType).map(Number).filter(Boolean)
const lineItemProps = {
  syncing: false,
  allowedSlippage: TEST_ALLOWED_SLIPPAGE,
}

function testTradeLineItems(trade: InterfaceTrade, props: Partial<typeof lineItemProps> = {}) {
  const { asFragment } = render(
    <>
      {AllLineItemsTypes.map((type) => (
        <SwapLineItem key={type} trade={trade} type={type} {...lineItemProps} {...props} />
      ))}
    </>,
  )
  expect(asFragment()).toMatchSnapshot()
}

/* eslint-disable jest/expect-expect */ // allow expect inside testTradeLineItems
