import '~/test-utils/tokens/mocks'
import 'utilities/src/logger/mocks'
<<<<<<< HEAD
import { WETH9 } from '@luxamm/sdk-core'
import { TradingApi } from '@l.x/api'
import { DAI } from '@l.x/lx/src/constants/tokens'
import { UniverseChainId } from '@l.x/lx/src/features/chains/types'
=======
import { WETH9 } from '@uniswap/sdk-core'
import { TradingApi } from '@universe/api'
import { DAI } from 'uniswap/src/constants/tokens'
import { UniverseChainId } from 'uniswap/src/features/chains/types'
>>>>>>> upstream/main
import {
  TransactionOriginType,
  TransactionStatus,
  TransactionType,
<<<<<<< HEAD
  DEXOrderDetails,
} from '@l.x/lx/src/features/transactions/types/transactionDetails'
import { currencyId } from '@l.x/lx/src/utils/currencyId'
import { OrderContent } from '~/components/AccountDrawer/MiniPortfolio/Activity/OffchainActivityModal'
import { render } from '~/test-utils/render'

vi.mock('lx/src/features/language/localizedDayjs', () => ({
=======
  UniswapXOrderDetails,
} from 'uniswap/src/features/transactions/types/transactionDetails'
import { currencyId } from 'uniswap/src/utils/currencyId'
import { OrderContent } from '~/components/AccountDrawer/MiniPortfolio/Activity/OffchainActivityModal'
import { render } from '~/test-utils/render'

vi.mock('uniswap/src/features/language/localizedDayjs', () => ({
>>>>>>> upstream/main
  useFormattedDateTime: vi.fn(() => 'Mock Date'),
  useLocalizedDayjs: vi.fn(() => (timestamp: number) => timestamp), // Returns timestamp as-is since useFormattedDateTime is mocked
  FORMAT_DATE_TIME_SHORT: 'lll',
  FORMAT_DATE_TIME_MEDIUM: 'LLL',
}))

describe('OrderContent', () => {
  it('should render without error, filled order', () => {
<<<<<<< HEAD
    const order: DEXOrderDetails = {
=======
    const order: UniswapXOrderDetails = {
>>>>>>> upstream/main
      hash: '0xad7a8f73f28fd0cc16459111899dd1632164ae139fcf5281a1bced56e1ff6564',
      orderHash: '0xad7a8f73f28fd0cc16459111899dd1632164ae139fcf5281a1bced56e1ff6564',
      from: '0xSenderAddress',
      id: 'tx123',
      chainId: UniverseChainId.Mainnet,
      routing: TradingApi.Routing.DUTCH_V2,
      status: TransactionStatus.Success,
      addedTime: 1701715079,
      transactionOriginType: TransactionOriginType.Internal,
      typeInfo: {
<<<<<<< HEAD
        isLXOrder: true,
=======
        isUniswapXOrder: true,
>>>>>>> upstream/main
        type: TransactionType.Swap,
        tradeType: 0,
        inputCurrencyId: currencyId(DAI),
        outputCurrencyId: currencyId(WETH9[UniverseChainId.Mainnet]),
        inputCurrencyAmountRaw: '252074033564766400000',
        expectedOutputCurrencyAmountRaw: '106841079134757921',
        minimumOutputCurrencyAmountRaw: '106841079134757921',
        settledOutputCurrencyAmountRaw: '106841079134757921',
      },
    }
    const { container } = render(<OrderContent order={order} />)
    expect(container).toMatchSnapshot()
    expect(container).toHaveTextContent('Order executed')
  })

  it('should render without error, open order', () => {
<<<<<<< HEAD
    const order: DEXOrderDetails = {
=======
    const order: UniswapXOrderDetails = {
>>>>>>> upstream/main
      chainId: 1,
      routing: TradingApi.Routing.DUTCH_V2,
      status: TransactionStatus.Pending,
      encodedOrder: '0xencodedOrder',
      expiry: 1701715179,
      addedTime: 1701715079,
      orderHash: '0xad7a8f73f28fd0cc16459111899dd1632164ae139fcf5281a1bced56e1ff6564',
      hash: '0xad7a8f73f28fd0cc16459111899dd1632164ae139fcf5281a1bced56e1ff6564',
      from: '0xSenderAddress',
      id: 'tx123',
      transactionOriginType: TransactionOriginType.Internal,
      typeInfo: {
<<<<<<< HEAD
        isLXOrder: true,
=======
        isUniswapXOrder: true,
>>>>>>> upstream/main
        type: TransactionType.Swap,
        tradeType: 0,
        inputCurrencyId: currencyId(DAI),
        outputCurrencyId: currencyId(WETH9[UniverseChainId.Mainnet]),
        inputCurrencyAmountRaw: '252074033564766400000',
        expectedOutputCurrencyAmountRaw: '106841079134757921',
        minimumOutputCurrencyAmountRaw: '106841079134757921',
        settledOutputCurrencyAmountRaw: '106841079134757921',
      },
    }
    const { container } = render(<OrderContent order={order} />)
    expect(container).toMatchSnapshot()
    expect(container).toHaveTextContent('Order pending')
    expect(container).toHaveTextContent('Cancel order')
  })

  it('should render without error, limit order', () => {
<<<<<<< HEAD
    const order: DEXOrderDetails = {
=======
    const order: UniswapXOrderDetails = {
>>>>>>> upstream/main
      chainId: UniverseChainId.Mainnet,
      routing: TradingApi.Routing.DUTCH_LIMIT,
      status: TransactionStatus.Pending,
      encodedOrder: '0xencodedOrder',
      expiry: 1701715179,
      addedTime: 1701715079,
      orderHash: '0xad7a8f73f28fd0cc16459111899dd1632164ae139fcf5281a1bced56e1ff6564',
      hash: '0xad7a8f73f28fd0cc16459111899dd1632164ae139fcf5281a1bced56e1ff6564',
      from: '0xSenderAddress',
      id: 'tx123',
      transactionOriginType: TransactionOriginType.Internal,
      typeInfo: {
<<<<<<< HEAD
        isLXOrder: true,
=======
        isUniswapXOrder: true,
>>>>>>> upstream/main
        type: TransactionType.Swap,
        tradeType: 0,
        inputCurrencyId: currencyId(DAI),
        outputCurrencyId: currencyId(WETH9[UniverseChainId.Mainnet]),
        inputCurrencyAmountRaw: '252074033564766400000',
        expectedOutputCurrencyAmountRaw: '106841079134757921',
        minimumOutputCurrencyAmountRaw: '106841079134757921',
        settledOutputCurrencyAmountRaw: '106841079134757921',
      },
    }
    const { container } = render(<OrderContent order={order} />)
    expect(container).toMatchSnapshot()
    expect(container).toHaveTextContent('Limit pending')
    expect(container).toHaveTextContent('Cancel limit')
  })
})
