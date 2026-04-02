import { TradingApi } from '@universe/api'
import { UniverseChainId } from 'lx/src/features/chains/types'
import { finalizeTransaction, updateTransaction } from 'lx/src/features/transactions/slice'
import {
  TransactionOriginType,
  TransactionStatus,
  TransactionType,
  type LxSwapOrderDetails,
} from 'lx/src/features/transactions/types/transactionDetails'
import { isFinalizedTx } from 'lx/src/features/transactions/types/utils'
import { popupRegistry } from '~/components/Popups/registry'
import { PopupType } from '~/components/Popups/types'
import { useHandleLXActivityUpdate } from '~/hooks/useHandleLXActivityUpdate'
import { ActivityUpdateTransactionType, type LxSwapOrderUpdate } from '~/state/activity/types'
import { mocked } from '~/test-utils/mocked'
import { renderHook } from '~/test-utils/render'
import { logLxSwapSwapFinalized } from '~/tracing/swapFlowLoggers'

const dispatchMock = vi.fn()
vi.mock('~/state/hooks', async () => {
  const actual = await vi.importActual('~/state/hooks')
  return {
    ...actual,
    useAppDispatch: () => dispatchMock,
  }
})

vi.mock('@luxamm/analytics', () => ({
  useTrace: vi.fn(() => ({ trace: 'mock-trace' })),
}))

vi.mock('~/components/Popups/registry', () => ({
  popupRegistry: {
    addPopup: vi.fn(),
  },
}))

vi.mock('~/tracing/swapFlowLoggers', () => ({
  logLxSwapSwapFinalized: vi.fn(),
}))

vi.mock('lx/src/features/transactions/types/utils', () => ({
  isFinalizedTx: vi.fn(),
}))

describe('useHandleLXActivityUpdate', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const createMockLxSwapOrderDetails = (overrides?: Partial<LxSwapOrderDetails>): LxSwapOrderDetails => ({
    id: 'order-id',
    from: '0xSenderAddress',
    chainId: UniverseChainId.Mainnet,
    status: TransactionStatus.Pending,
    addedTime: Date.now(),
    transactionOriginType: TransactionOriginType.Internal,
    typeInfo: {
      type: TransactionType.Swap,
      tradeType: 0,
      inputCurrencyId: '0xInputToken',
      outputCurrencyId: '0xOutputToken',
      inputCurrencyAmountRaw: '1000000000000000000',
      outputCurrencyAmountRaw: '2000000000000000000',
      minimumOutputCurrencyAmountRaw: '1900000000000000000',
      expectedOutputCurrencyAmountRaw: '2000000000000000000',
      settledOutputCurrencyAmountRaw: '2000000000000000000',
      isFinalStep: true,
      swapStartTimestamp: 1700000000000,
      planId: 'mock-plan-id',
      stepIndex: 0,
      totalSteps: 2,
      totalNonErrorSteps: 2,
      stepType: 'SwapTransaction',
    },
    routing: TradingApi.Routing.DUTCH_V2,
    orderHash: '0xOrderHash',
    hash: undefined,
    ...overrides,
  })

  const createMockActivity = (
    originalOverrides?: Partial<LxSwapOrderDetails>,
    updateOverrides?: Partial<LxSwapOrderDetails>,
  ): LxSwapOrderUpdate => ({
    type: ActivityUpdateTransactionType.LxSwapOrder,
    chainId: UniverseChainId.Mainnet,
    original: createMockLxSwapOrderDetails(originalOverrides),
    update: createMockLxSwapOrderDetails({
      ...originalOverrides,
      ...updateOverrides,
    }),
  })

  it('should finalize transaction when update is finalized', () => {
    mocked(isFinalizedTx).mockReturnValue(true)

    const { result } = renderHook(() => useHandleLXActivityUpdate())
    const handleUpdate = result.current

    const activity = createMockActivity(
      { status: TransactionStatus.Pending },
      { status: TransactionStatus.Success, hash: '0xSuccessHash' },
    )

    handleUpdate({
      activity,
      popupDismissalTime: 5000,
    })

    // Should call both updateTransaction and finalizeTransaction when finalized
    expect(dispatchMock).toHaveBeenCalledWith(
      expect.objectContaining({
        type: updateTransaction.type,
        payload: activity.update,
      }),
    )
    expect(dispatchMock).toHaveBeenCalledWith(
      expect.objectContaining({
        type: finalizeTransaction.type,
        payload: activity.update,
      }),
    )
  })

  it('should update transaction when update is not finalized', () => {
    mocked(isFinalizedTx).mockReturnValue(false)

    const { result } = renderHook(() => useHandleLXActivityUpdate())
    const handleUpdate = result.current

    const activity = createMockActivity({ status: TransactionStatus.Pending }, { status: TransactionStatus.Pending })

    handleUpdate({
      activity,
      popupDismissalTime: 5000,
    })

    // Should only call updateTransaction when not finalized
    expect(dispatchMock).toHaveBeenCalledWith(
      expect.objectContaining({
        type: updateTransaction.type,
        payload: activity.update,
      }),
    )
    expect(dispatchMock).not.toHaveBeenCalledWith(
      expect.objectContaining({
        type: finalizeTransaction.type,
      }),
    )
  })

  describe('popup handling', () => {
    it('should add transaction popup when update is successful with hash', () => {
      mocked(isFinalizedTx).mockReturnValue(true)

      const { result } = renderHook(() => useHandleLXActivityUpdate())
      const handleUpdate = result.current

      const activity = createMockActivity(
        { status: TransactionStatus.Pending },
        { status: TransactionStatus.Success, hash: '0xSuccessHash' },
      )

      handleUpdate({
        activity,
        popupDismissalTime: 5000,
      })

      expect(popupRegistry.addPopup).toHaveBeenCalledWith(
        {
          type: PopupType.Transaction,
          hash: '0xSuccessHash',
        },
        '0xSuccessHash',
        5000,
      )
    })

    it('should add order popup when status changes and no success hash', () => {
      mocked(isFinalizedTx).mockReturnValue(false)

      const { result } = renderHook(() => useHandleLXActivityUpdate())
      const handleUpdate = result.current

      const activity = createMockActivity(
        { status: TransactionStatus.Pending, orderHash: '0xOrderHash' },
        { status: TransactionStatus.Canceled, hash: undefined },
      )

      handleUpdate({
        activity,
        popupDismissalTime: 5000,
      })

      expect(popupRegistry.addPopup).toHaveBeenCalledWith(
        {
          type: PopupType.Order,
          orderHash: '0xOrderHash',
        },
        '0xOrderHash',
        5000,
      )
    })

    it('should not add popup when status does not change', () => {
      mocked(isFinalizedTx).mockReturnValue(false)

      const { result } = renderHook(() => useHandleLXActivityUpdate())
      const handleUpdate = result.current

      const activity = createMockActivity({ status: TransactionStatus.Pending }, { status: TransactionStatus.Pending })

      handleUpdate({
        activity,
        popupDismissalTime: 5000,
      })

      expect(popupRegistry.addPopup).not.toHaveBeenCalled()
    })

    it('should not add order popup when original has no orderHash', () => {
      mocked(isFinalizedTx).mockReturnValue(false)

      const { result } = renderHook(() => useHandleLXActivityUpdate())
      const handleUpdate = result.current

      const activity = createMockActivity(
        { status: TransactionStatus.Pending, orderHash: undefined },
        { status: TransactionStatus.Canceled, hash: undefined },
      )

      handleUpdate({
        activity,
        popupDismissalTime: 5000,
      })

      expect(popupRegistry.addPopup).not.toHaveBeenCalledWith(
        expect.objectContaining({
          type: PopupType.Order,
        }),
        expect.any(String),
        expect.any(Number),
      )
    })
  })

  describe('analytics logging', () => {
    it('should log successful non-limit order', () => {
      mocked(isFinalizedTx).mockReturnValue(false)

      const { result } = renderHook(() => useHandleLXActivityUpdate())
      const handleUpdate = result.current

      const activity = createMockActivity(
        { routing: TradingApi.Routing.DUTCH_V2, orderHash: '0xOrderHash' },
        { status: TransactionStatus.Success, hash: '0xSuccessHash' },
      )

      handleUpdate({
        activity,
        popupDismissalTime: 5000,
      })

      expect(logLxSwapSwapFinalized).toHaveBeenCalledWith({
        id: 'order-id',
        hash: '0xSuccessHash',
        orderHash: '0xOrderHash',
        chainId: UniverseChainId.Mainnet,
        analyticsContext: { trace: 'mock-trace' },
        routing: TradingApi.Routing.DUTCH_V2,
        status: TransactionStatus.Success,
        swapStartTimestamp: 1700000000000,
        planAnalytics: {
          isFinalStep: true,
          planId: 'mock-plan-id',
          stepIndex: 0,
          totalSteps: 2,
          totalNonErrorSteps: 2,
          stepType: 'SwapTransaction',
        },
        transactedUSDValue: undefined,
      })
    })

    it('should not log successful limit order', () => {
      mocked(isFinalizedTx).mockReturnValue(false)

      const { result } = renderHook(() => useHandleLXActivityUpdate())
      const handleUpdate = result.current

      const activity = createMockActivity(
        { routing: TradingApi.Routing.DUTCH_LIMIT, orderHash: '0xOrderHash' },
        { status: TransactionStatus.Success },
      )

      handleUpdate({
        activity,
        popupDismissalTime: 5000,
      })

      expect(logLxSwapSwapFinalized).not.toHaveBeenCalled()
    })

    it('should log canceled order', () => {
      mocked(isFinalizedTx).mockReturnValue(false)

      const { result } = renderHook(() => useHandleLXActivityUpdate())
      const handleUpdate = result.current

      const activity = createMockActivity(
        { routing: TradingApi.Routing.DUTCH_V2, orderHash: '0xOrderHash' },
        { status: TransactionStatus.Canceled, hash: '0xCancelHash' },
      )

      handleUpdate({
        activity,
        popupDismissalTime: 5000,
      })

      expect(logLxSwapSwapFinalized).toHaveBeenCalledWith({
        id: 'order-id',
        hash: '0xCancelHash',
        orderHash: '0xOrderHash',
        chainId: UniverseChainId.Mainnet,
        analyticsContext: { trace: 'mock-trace' },
        routing: TradingApi.Routing.DUTCH_V2,
        status: TransactionStatus.Canceled,
        swapStartTimestamp: 1700000000000,
        planAnalytics: {
          isFinalStep: true,
          planId: 'mock-plan-id',
          stepIndex: 0,
          totalSteps: 2,
          totalNonErrorSteps: 2,
          stepType: 'SwapTransaction',
        },
        transactedUSDValue: undefined,
      })
    })

    it('should log expired order', () => {
      mocked(isFinalizedTx).mockReturnValue(false)

      const { result } = renderHook(() => useHandleLXActivityUpdate())
      const handleUpdate = result.current

      const activity = createMockActivity(
        { routing: TradingApi.Routing.DUTCH_V2, orderHash: '0xOrderHash' },
        { status: TransactionStatus.Expired },
      )

      handleUpdate({
        activity,
        popupDismissalTime: 5000,
      })

      expect(logLxSwapSwapFinalized).toHaveBeenCalledWith({
        id: 'order-id',
        hash: undefined,
        orderHash: '0xOrderHash',
        chainId: UniverseChainId.Mainnet,
        analyticsContext: { trace: 'mock-trace' },
        routing: TradingApi.Routing.DUTCH_V2,
        status: TransactionStatus.Expired,
        swapStartTimestamp: 1700000000000,
        planAnalytics: {
          isFinalStep: true,
          planId: 'mock-plan-id',
          stepIndex: 0,
          totalSteps: 2,
          totalNonErrorSteps: 2,
          stepType: 'SwapTransaction',
        },
        transactedUSDValue: undefined,
      })
    })

    it('should not log when original has no orderHash', () => {
      mocked(isFinalizedTx).mockReturnValue(false)

      const { result } = renderHook(() => useHandleLXActivityUpdate())
      const handleUpdate = result.current

      const activity = createMockActivity({ orderHash: undefined }, { status: TransactionStatus.Success })

      handleUpdate({
        activity,
        popupDismissalTime: 5000,
      })

      expect(logLxSwapSwapFinalized).not.toHaveBeenCalled()
    })

    it('should not log for pending status', () => {
      mocked(isFinalizedTx).mockReturnValue(false)

      const { result } = renderHook(() => useHandleLXActivityUpdate())
      const handleUpdate = result.current

      const activity = createMockActivity({ orderHash: '0xOrderHash' }, { status: TransactionStatus.Pending })

      handleUpdate({
        activity,
        popupDismissalTime: 5000,
      })

      expect(logLxSwapSwapFinalized).not.toHaveBeenCalled()
    })
  })
})
