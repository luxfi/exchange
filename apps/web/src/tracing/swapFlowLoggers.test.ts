<<<<<<< HEAD
import { TradingApi } from '@l.x/api'
import { SwapEventName } from '@l.x/lx/src/features/telemetry/constants'
import { sendAnalyticsEvent } from '@l.x/lx/src/features/telemetry/send'
import { maybeLogFirstSwapAction } from '@l.x/lx/src/features/transactions/swap/utils/maybeLogFirstSwapAction'
=======
import { TradingApi } from '@universe/api'
import { SwapEventName } from 'uniswap/src/features/telemetry/constants'
import { sendAnalyticsEvent } from 'uniswap/src/features/telemetry/send'
import { maybeLogFirstSwapAction } from 'uniswap/src/features/transactions/swap/utils/maybeLogFirstSwapAction'
>>>>>>> upstream/main
import {
  TransactionOriginType,
  TransactionStatus,
  TransactionType,
<<<<<<< HEAD
} from '@l.x/lx/src/features/transactions/types/transactionDetails'
import { logSwapFinalized, logLXSwapFinalized } from '~/tracing/swapFlowLoggers'

vi.mock('lx/src/features/telemetry/send', () => ({
  sendAnalyticsEvent: vi.fn(),
}))

vi.mock('lx/src/features/transactions/swap/utils/SwapEventTimestampTracker', async () => {
  const actual = await vi.importActual('lx/src/features/transactions/swap/utils/SwapEventTimestampTracker')
=======
} from 'uniswap/src/features/transactions/types/transactionDetails'
import { logSwapFinalized, logUniswapXSwapFinalized } from '~/tracing/swapFlowLoggers'

vi.mock('uniswap/src/features/telemetry/send', () => ({
  sendAnalyticsEvent: vi.fn(),
}))

vi.mock('uniswap/src/features/transactions/swap/utils/SwapEventTimestampTracker', async () => {
  const actual = await vi.importActual('uniswap/src/features/transactions/swap/utils/SwapEventTimestampTracker')
>>>>>>> upstream/main
  return {
    ...actual,
    timestampTracker: {
      hasTimestamp: () => false,
      setElapsedTime: () => 100,
      getElapsedTime: () => 100,
    },
  }
})

describe('swapFlowLoggers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('logSwapSuccess calls sendAnalyticsEvent with correct parameters', () => {
    const mockHash = 'mockHash'
    const mockBatchId = undefined
    const mockChainId = 1
    const mockAnalyticsContext = { page: 'mockContext' }

    logSwapFinalized({
      id: mockHash,
      hash: mockHash,
      batchId: mockBatchId,
      chainInId: mockChainId,
      chainOutId: mockChainId,
      analyticsContext: mockAnalyticsContext,
      status: TransactionStatus.Success,
      type: TransactionType.Swap,
    })

    expect(sendAnalyticsEvent).toHaveBeenCalledWith(SwapEventName.SwapTransactionCompleted, {
      transactionOriginType: TransactionOriginType.Internal,
      routing: 'classic',
      time_to_swap: 100,
      time_to_swap_since_first_input: 100,
      hash: mockHash,
      chain_id: mockChainId,
      chain_id_in: mockChainId,
      chain_id_out: mockChainId,
      id: mockHash,
      batch_id: mockBatchId,
      swap_start_timestamp: undefined,
      transactedUSDValue: undefined,
      plan_id: undefined,
      step_index: undefined,
      total_steps: undefined,
      total_non_error_steps: undefined,
      step_type: undefined,
      is_final_step: undefined,
      ...mockAnalyticsContext,
    })
  })

<<<<<<< HEAD
  it('logLXSwapSuccess calls sendAnalyticsEvent with correct parameters', () => {
=======
  it('logUniswapXSwapSuccess calls sendAnalyticsEvent with correct parameters', () => {
>>>>>>> upstream/main
    const mockHash = 'mockHash'
    const mockOrderHash = 'mockOrderHash'
    const mockChainId = 1
    const mockAnalyticsContext = { page: 'mockContext' }

<<<<<<< HEAD
    logLXSwapFinalized({
=======
    logUniswapXSwapFinalized({
>>>>>>> upstream/main
      id: 'mockId',
      hash: mockHash,
      orderHash: mockOrderHash,
      chainId: mockChainId,
      analyticsContext: mockAnalyticsContext,
      routing: TradingApi.Routing.DUTCH_V2,
      status: TransactionStatus.Success,
    })

    expect(sendAnalyticsEvent).toHaveBeenCalledWith(SwapEventName.SwapTransactionCompleted, {
      transactionOriginType: TransactionOriginType.Internal,
<<<<<<< HEAD
      routing: 'dex_v2',
=======
      routing: 'uniswap_x_v2',
>>>>>>> upstream/main
      time_to_swap: 100,
      time_to_swap_since_first_input: 100,
      hash: mockHash,
      order_hash: mockOrderHash,
      chain_id: mockChainId,
      id: 'mockId',
      swap_start_timestamp: undefined,
      transactedUSDValue: undefined,
      plan_id: undefined,
      step_index: undefined,
      total_steps: undefined,
      total_non_error_steps: undefined,
      step_type: undefined,
      is_final_step: undefined,
      ...mockAnalyticsContext,
    })
  })

  it('maybeLogFirstSwapAction calls sendAnalyticsEvent with correct parameters', () => {
    const mockAnalyticsContext = { page: 'mockContext' }

    maybeLogFirstSwapAction(mockAnalyticsContext)
    expect(sendAnalyticsEvent).toHaveBeenCalledWith(SwapEventName.SwapFirstAction, {
      time_to_first_swap_action: 100,
      ...mockAnalyticsContext,
    })
  })
})
