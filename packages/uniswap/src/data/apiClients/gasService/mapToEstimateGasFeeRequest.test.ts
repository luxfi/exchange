import { BigNumber } from 'ethers/lib/ethers'
import { mapToEstimateGasFeeRequest } from 'uniswap/src/data/apiClients/gasService/mapToEstimateGasFeeRequest'
import { describe, expect, it } from 'vitest'

const BASE_STRATEGY = {
  limitInflationFactor: 1.15,
  displayLimitInflationFactor: 1.0,
  priceInflationFactor: 1.5,
  percentileThresholdFor1559Fee: 75,
}

describe('mapToEstimateGasFeeRequest', () => {
  it('maps basic transaction fields', () => {
    const result = mapToEstimateGasFeeRequest({
      tx: {
        chainId: 1,
        from: '0xabc',
        to: '0xdef',
        data: '0x1234',
        value: '1000',
      },
      gasStrategy: BASE_STRATEGY,
    })

    expect(result.chainId).toBe(1)
    expect(result.from).toBe('0xabc')
    expect(result.to).toBe('0xdef')
    expect(result.data).toBe('0x1234')
    expect(result.value).toBe('1000')
  })

  it('serializes BigNumber value and gasLimit to string', () => {
    const result = mapToEstimateGasFeeRequest({
      tx: {
        chainId: 1,
        value: BigNumber.from('999'),
        gasLimit: BigNumber.from('21000'),
      },
      gasStrategy: BASE_STRATEGY,
    })

    expect(result.value).toBe('999')
    expect(result.gasLimit).toBe('21000')
  })

  it('maps gas strategy fields, omitting displayLimitInflationFactor', () => {
    const strategy = {
      ...BASE_STRATEGY,
      thresholdToInflateLastBlockBaseFee: 0.9,
      baseFeeMultiplier: 1.05,
      baseFeeHistoryWindow: 100,
      minPriorityFeeRatioOfBaseFee: 0.1,
      minPriorityFeeGwei: 1.0,
      maxPriorityFeeGwei: 9.0,
    }

    const result = mapToEstimateGasFeeRequest({
      tx: { chainId: 1 },
      gasStrategy: strategy,
    })

    const protoStrategy = result.gasStrategies?.[0]
    expect(protoStrategy).toBeDefined()
    expect(protoStrategy?.limitInflationFactor).toBe(1.15)
    expect(protoStrategy?.priceInflationFactor).toBe(1.5)
    expect(protoStrategy?.percentileThresholdFor1559Fee).toBe(75)
    expect(protoStrategy?.baseFeeMultiplier).toBe(1.05)
    expect(protoStrategy?.baseFeeHistoryWindow).toBe(100)
    // displayLimitInflationFactor should NOT be present
    expect(protoStrategy).not.toHaveProperty('displayLimitInflationFactor')
  })

  it('converts null optional strategy fields to undefined', () => {
    const strategy = {
      ...BASE_STRATEGY,
      thresholdToInflateLastBlockBaseFee: null,
      baseFeeMultiplier: null,
    }

    const result = mapToEstimateGasFeeRequest({
      tx: { chainId: 1 },
      gasStrategy: strategy,
    })

    const protoStrategy = result.gasStrategies?.[0]
    expect(protoStrategy?.thresholdToInflateLastBlockBaseFee).toBeUndefined()
    expect(protoStrategy?.baseFeeMultiplier).toBeUndefined()
  })

  it('includes smartContractDelegationAddress when provided', () => {
    const result = mapToEstimateGasFeeRequest({
      tx: { chainId: 1 },
      gasStrategy: BASE_STRATEGY,
      smartContractDelegationAddress: '0xdelegate',
    })

    expect(result.smartContractDelegationAddress).toBe('0xdelegate')
  })

  it('omits smartContractDelegationAddress when not provided', () => {
    const result = mapToEstimateGasFeeRequest({
      tx: { chainId: 1 },
      gasStrategy: BASE_STRATEGY,
    })

    expect(result.smartContractDelegationAddress).toBeUndefined()
  })
})
