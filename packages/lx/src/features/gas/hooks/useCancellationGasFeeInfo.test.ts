import 'utilities/src/logger/mocks'
import { useQuery } from '@tanstack/react-query'
import { renderHook } from '@testing-library/react'
import { providers } from 'ethers'
import { useTransactionGasFee } from 'lx/src/features/gas/hooks'
import { useCancellationGasFeeInfo } from 'lx/src/features/gas/hooks/useCancellationGasFeeInfo'
import { usePlanCancellationGasFeeInfo } from 'lx/src/features/gas/hooks/usePlanCancellationGasFeeInfo'
import * as CancelUtils from 'lx/src/features/gas/utils/cancel'
import * as CancelMultipleOrders from 'lx/src/features/transactions/cancel/cancelMultipleOrders'
import { getCancelOrderTxRequest } from 'lx/src/features/transactions/cancel/getCancelOrderTxRequest'
import { isDEX } from 'lx/src/features/transactions/swap/utils/routing'
import {
  TransactionDetails,
  TransactionType,
  DEXOrderDetails,
} from 'lx/src/features/transactions/types/transactionDetails'
import type { Mock } from 'vitest'

// Mock QueryClient before any imports that might use it
vi.mock('@tanstack/react-query', () => ({
  QueryClient: vi.fn().mockImplementation(() => ({
    defaultOptions: {},
  })),
  useQuery: vi.fn(),
}))

vi.mock('ui/src/assets/logos/png/all-networks-icon.png', () => ({ default: 'mocked-image' }))

vi.mock('lx/src/features/gas/hooks', () => ({
  useTransactionGasFee: vi.fn(),
}))
vi.mock('lx/src/features/gas/hooks/usePlanCancellationGasFeeInfo', () => ({
  usePlanCancellationGasFeeInfo: vi.fn(),
}))
vi.mock('lx/src/features/gas/utils/cancel', () => ({
  CancellationType: {
    Classic: 'classic',
    DEX: 'dex',
  },
  getCancellationType: vi.fn(),
  createClassicCancelRequest: vi.fn(),
  calculateCancellationGasFee: vi.fn(),
}))
vi.mock('lx/src/features/transactions/cancel/getCancelOrderTxRequest')
vi.mock('lx/src/features/transactions/cancel/cancelMultipleOrders', () => ({
  extractCancellationData: vi.fn(),
  getCancelMultipleDEXOrdersTransaction: vi.fn(),
}))
vi.mock('lx/src/features/transactions/swap/utils/routing')

describe('useCancellationGasFeeInfo', () => {
  let mockUseTransactionGasFee: Mock
  let mockUsePlanCancellationGasFeeInfo: Mock
  let mockCalculateCancellationGasFee: Mock
  let mockGetCancellationType: Mock
  let mockCreateClassicCancelRequest: Mock
  let mockGetCancelOrderTxRequest: Mock
  let mockExtractCancellationData: Mock
  let mockGetCancelMultipleDEXOrdersTransaction: Mock
  let mockIsDEX: Mock
  let mockUseQuery: Mock

  const mockTx: TransactionDetails = {
    id: 'mockTx',
    chainId: 1,
    from: '0x123',
    typeInfo: { type: TransactionType.Swap },
  } as TransactionDetails
  const mockOrders: DEXOrderDetails[] = [{ id: 'mockOrder', orderHash: '0xorder1' } as DEXOrderDetails]
  const mockGasFee = { value: '100', displayValue: '0.1' }
  const mockClassicCancelRequest = { to: 'classic' } as providers.TransactionRequest
  const mockDEXCancelRequest = { to: 'dex' } as providers.TransactionRequest

  beforeEach(() => {
    mockUseTransactionGasFee = useTransactionGasFee as Mock
    mockUsePlanCancellationGasFeeInfo = usePlanCancellationGasFeeInfo as Mock
    mockCalculateCancellationGasFee = CancelUtils.calculateCancellationGasFee as Mock
    mockGetCancellationType = CancelUtils.getCancellationType as Mock
    mockCreateClassicCancelRequest = CancelUtils.createClassicCancelRequest as Mock
    mockGetCancelOrderTxRequest = getCancelOrderTxRequest as Mock
    mockExtractCancellationData = CancelMultipleOrders.extractCancellationData as Mock
    mockGetCancelMultipleDEXOrdersTransaction =
      CancelMultipleOrders.getCancelMultipleDEXOrdersTransaction as Mock
    mockIsDEX = isDEX as unknown as Mock
    mockUseQuery = useQuery as Mock

    mockUseTransactionGasFee.mockReturnValue(mockGasFee)
    mockUsePlanCancellationGasFeeInfo.mockReturnValue(undefined)
    mockCreateClassicCancelRequest.mockReturnValue(mockClassicCancelRequest)
    mockUseQuery.mockReturnValue({ data: mockDEXCancelRequest, isLoading: false, error: null })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should return undefined if calculateCancellationGasFee returns undefined', () => {
    mockGetCancellationType.mockReturnValue(CancelUtils.CancellationType.Classic)
    mockCalculateCancellationGasFee.mockReturnValue(undefined)
    const { result } = renderHook(() => useCancellationGasFeeInfo(mockTx, mockOrders))
    expect(result.current).toBeUndefined()
  })

  describe('Classic Cancellations', () => {
    beforeEach(() => {
      mockGetCancellationType.mockReturnValue(CancelUtils.CancellationType.Classic)
    })

    it('should use classic cancellation request', () => {
      renderHook(() => useCancellationGasFeeInfo(mockTx))
      expect(mockUseTransactionGasFee).toHaveBeenCalledWith({
        tx: mockClassicCancelRequest,
        skip: false,
      })
    })

    it('should call calculateCancellationGasFee with correct params', () => {
      renderHook(() => useCancellationGasFeeInfo(mockTx))
      expect(mockCalculateCancellationGasFee).toHaveBeenCalledWith({
        type: CancelUtils.CancellationType.Classic,
        transaction: mockTx,
        gasFee: mockGasFee,
        cancelRequest: mockClassicCancelRequest,
        orders: undefined,
      })
    })
  })

  describe('with DEX orders', () => {
    beforeEach(() => {
      mockGetCancellationType.mockReturnValue(CancelUtils.CancellationType.DEX)
      mockExtractCancellationData.mockReturnValue([
        { orderHash: '0xorder1', encodedOrder: '0xencoded', routing: 'DUTCH_V2' },
      ])
      mockGetCancelMultipleDEXOrdersTransaction.mockResolvedValue(mockDEXCancelRequest)
      mockIsDEX.mockReturnValue(false)
    })

    it('should use DEX cancellation request for batch orders', () => {
      renderHook(() => useCancellationGasFeeInfo(mockTx, mockOrders))

      expect(mockUseQuery).toHaveBeenCalled()
      const queryCall = mockUseQuery.mock.calls[0]
      expect(queryCall?.[0]?.enabled).toBe(true)
      expect(queryCall?.[0]?.queryKey).toContain('batch')
    })

    it('should handle single DEX transaction', () => {
      mockIsDEX.mockReturnValue(true)
      mockGetCancelOrderTxRequest.mockResolvedValue(mockDEXCancelRequest)

      renderHook(() => useCancellationGasFeeInfo(mockTx))

      expect(mockUseQuery).toHaveBeenCalled()
      const queryCall = mockUseQuery.mock.calls[0]
      expect(queryCall?.[0]?.queryKey).toContain(mockTx.id)
    })

    it('should skip gas fee calculation when no cancel request', () => {
      mockUseQuery.mockReturnValue({ data: undefined, isLoading: false, error: null })

      renderHook(() => useCancellationGasFeeInfo(mockTx, mockOrders))

      expect(mockUseTransactionGasFee).toHaveBeenCalledWith({
        tx: undefined,
        skip: true,
      })
    })
  })
})
