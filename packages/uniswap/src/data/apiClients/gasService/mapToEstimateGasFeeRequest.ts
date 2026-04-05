import { type PartialMessage } from '@bufbuild/protobuf'
import { type TransactionRequest } from '@ethersproject/providers'
import type {
  EstimateGasFeeRequest,
  GasStrategy as ProtoGasStrategy,
} from '@uniswap/client-unirpc-v2/dist/uniswap/unirpc/v2/service_pb'
import { type GasStrategy } from '@universe/api'

export function mapToEstimateGasFeeRequest({
  tx,
  gasStrategy,
  smartContractDelegationAddress,
}: {
  tx: TransactionRequest
  gasStrategy: GasStrategy
  smartContractDelegationAddress?: string
}): PartialMessage<EstimateGasFeeRequest> {
  const protoStrategy: PartialMessage<ProtoGasStrategy> = {
    limitInflationFactor: gasStrategy.limitInflationFactor,
    priceInflationFactor: gasStrategy.priceInflationFactor,
    percentileThresholdFor1559Fee: gasStrategy.percentileThresholdFor1559Fee,
    thresholdToInflateLastBlockBaseFee: gasStrategy.thresholdToInflateLastBlockBaseFee ?? undefined,
    baseFeeMultiplier: gasStrategy.baseFeeMultiplier ?? undefined,
    baseFeeHistoryWindow: gasStrategy.baseFeeHistoryWindow ?? undefined,
    minPriorityFeeRatioOfBaseFee: gasStrategy.minPriorityFeeRatioOfBaseFee ?? undefined,
    minPriorityFeeGwei: gasStrategy.minPriorityFeeGwei ?? undefined,
    maxPriorityFeeGwei: gasStrategy.maxPriorityFeeGwei ?? undefined,
  }

  return {
    chainId: tx.chainId,
    from: tx.from,
    to: tx.to,
    data: tx.data?.toString(),
    value: tx.value?.toString(),
    gasLimit: tx.gasLimit?.toString(),
    gasStrategies: [protoStrategy],
    ...(smartContractDelegationAddress ? { smartContractDelegationAddress } : {}),
  }
}
