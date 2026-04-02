import { TradingApi } from '@luxexchange/api'
import { SwapEventName } from '@luxexchange/lx/src/features/telemetry/constants'
import { sendAnalyticsEvent } from '@luxexchange/lx/src/features/telemetry/send'
import { maybeLogFirstSwapAction } from '@luxexchange/lx/src/features/transactions/swap/utils/maybeLogFirstSwapAction'
import {
  TransactionOriginType,
  TransactionStatus,
  TransactionType,
} from '@luxexchange/lx/src/features/transactions/types/transactionDetails'
import { logSwapFinalized, logLxSwapSwapFinalized } from '~/tracing/swapFlowLoggers'

vi.mock('lx/src/features/telemetry/send', () => ({
  sendAnalyticsEvent: vi.fn(),
}))

vi.mock('lx/src/features/transactions/swap/utils/SwapEventTimestampTracker', async () => {
  const actual = await vi.importActual('lx/src/features/transactions/swap/utils/SwapEventTimestampTracker')
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

  it('logLxSwapSwapSuccess calls sendAnalyticsEvent with correct parameters', () => {
    const mockHash = 'mockHash'
    const mockOrderHash = 'mockOrderHash'
    const mockChainId = 1
    const mockAnalyticsContext = { page: 'mockContext' }

    logLxSwapSwapFinalized({
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
      routing: 'dex_v2',
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
