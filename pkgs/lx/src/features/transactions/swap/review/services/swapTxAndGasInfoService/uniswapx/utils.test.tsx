import { processLXResponse } from 'lx/src/features/transactions/swap/review/services/swapTxAndGasInfoService/lxswap/utils'
import { createMockPermitData } from 'lx/src/test/fixtures/transactions/swap'

describe('processLXResponse', () => {
  it('should return swapTxAndGasInfo with zero gas fee', () => {
    // Given
    const permitData = createMockPermitData('USDC')

    // When
    const result = processLXResponse({
      permitData,
    })

    // Then
    expect(result).toEqual({
      gasFeeResult: {
        value: '0',
        displayValue: '0',
        error: null,
        isLoading: false,
      },
      gasEstimate: {},
      transactionRequest: undefined,
      swapRequestArgs: undefined,
      permitData,
    })
  })
})
