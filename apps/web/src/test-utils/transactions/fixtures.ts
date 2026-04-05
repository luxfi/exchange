<<<<<<< HEAD
import { TradeType } from '@luxamm/sdk-core'
import { TradingApi } from '@l.x/api'
import { UniverseChainId } from '@l.x/lx/src/features/chains/types'
=======
import { TradeType } from '@uniswap/sdk-core'
import { TradingApi } from '@universe/api'
import { UniverseChainId } from 'uniswap/src/features/chains/types'
>>>>>>> upstream/main
import {
  TransactionOriginType,
  TransactionStatus,
  TransactionType,
<<<<<<< HEAD
  DEXOrderDetails,
} from '@l.x/lx/src/features/transactions/types/transactionDetails'

/**
 * Creates a mock DEXOrderDetails object for testing
 * @param overrides - Partial overrides for the default values
 * @returns A complete DEXOrderDetails object
 */
export function createMockDEXOrder(overrides?: Partial<DEXOrderDetails>): DEXOrderDetails {
  const defaults: DEXOrderDetails = {
=======
  UniswapXOrderDetails,
} from 'uniswap/src/features/transactions/types/transactionDetails'

/**
 * Creates a mock UniswapXOrderDetails object for testing
 * @param overrides - Partial overrides for the default values
 * @returns A complete UniswapXOrderDetails object
 */
export function createMockUniswapXOrder(overrides?: Partial<UniswapXOrderDetails>): UniswapXOrderDetails {
  const defaults: UniswapXOrderDetails = {
>>>>>>> upstream/main
    routing: TradingApi.Routing.DUTCH_V2,
    orderHash: '0xdefault-order-hash',
    status: TransactionStatus.Pending,
    typeInfo: {
<<<<<<< HEAD
      isLXOrder: true,
=======
      isUniswapXOrder: true,
>>>>>>> upstream/main
      type: TransactionType.Swap,
      tradeType: TradeType.EXACT_INPUT,
      inputCurrencyId: 'DAI',
      outputCurrencyId: 'USDC',
      inputCurrencyAmountRaw: '1000000000000000000',
      expectedOutputCurrencyAmountRaw: '1000000',
      minimumOutputCurrencyAmountRaw: '950000',
      settledOutputCurrencyAmountRaw: '1000000',
    },
    encodedOrder: '0xdefault-encoded-order',
    id: 'default-id',
    addedTime: Date.now(),
    chainId: UniverseChainId.Mainnet,
    expiry: Date.now() + 3600000, // 1 hour from now
    from: '0x0000000000000000000000000000000000000000',
    transactionOriginType: TransactionOriginType.Internal,
  }

  return {
    ...defaults,
    ...overrides,
    typeInfo: {
      ...defaults.typeInfo,
      ...(overrides?.typeInfo || {}),
    },
<<<<<<< HEAD
  } as DEXOrderDetails
=======
  } as UniswapXOrderDetails
>>>>>>> upstream/main
}
