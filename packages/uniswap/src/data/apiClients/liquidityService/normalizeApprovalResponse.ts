import { CheckApprovalLPResponse } from '@uniswap/client-liquidity/dist/uniswap/liquidity/v1/api_pb'
import {
  type NFTPermitData,
  type PermitBatchData,
  type TransactionRequest,
} from '@uniswap/client-liquidity/dist/uniswap/liquidity/v1/types_pb'
import { type LPApprovalResponse } from '@uniswap/client-liquidity/dist/uniswap/liquidity/v2/api_pb'
import { type ApprovalTransactionRequest } from '@uniswap/client-liquidity/dist/uniswap/liquidity/v2/types_pb'
import { permit2Address } from '@uniswap/permit2-sdk'
import { Platform } from 'uniswap/src/features/platforms/types/Platform'
import { areAddressesEqual } from 'uniswap/src/utils/addresses'

function areEvmAddressesEqual(a: string, b: string): boolean {
  return areAddressesEqual({
    addressInput1: { address: a, platform: Platform.EVM },
    addressInput2: { address: b, platform: Platform.EVM },
  })
}

function isPermitTransaction(tx: ApprovalTransactionRequest): boolean {
  if (!tx.transaction?.to || !tx.transaction.chainId) {
    return false
  }

  return areEvmAddressesEqual(tx.transaction.to, permit2Address(tx.transaction.chainId))
}

export interface NormalizedApprovalData {
  token0Approval?: TransactionRequest
  token1Approval?: TransactionRequest
  positionTokenApproval?: TransactionRequest
  token0Cancel?: TransactionRequest
  token1Cancel?: TransactionRequest
  token0PermitTransaction?: TransactionRequest
  token1PermitTransaction?: TransactionRequest
  v4BatchPermitData?: PermitBatchData
  v3NftPermitData?: NFTPermitData
  gasFeeToken0Approval?: string
  gasFeeToken1Approval?: string
  gasFeePositionTokenApproval?: string
  gasFeeToken0Cancel?: string
  gasFeeToken1Cancel?: string
  gasFeeToken0Permit?: string
  gasFeeToken1Permit?: string
}

function normalizeV1Response(response: CheckApprovalLPResponse): NormalizedApprovalData {
  return {
    token0Approval: response.token0Approval,
    token1Approval: response.token1Approval,
    positionTokenApproval: response.positionTokenApproval,
    token0Cancel: response.token0Cancel,
    token1Cancel: response.token1Cancel,
    token0PermitTransaction: response.token0PermitTransaction,
    token1PermitTransaction: response.token1PermitTransaction,
    v4BatchPermitData: response.permitData.case === 'permitBatchData' ? response.permitData.value : undefined,
    v3NftPermitData: response.permitData.case === 'nftPermitData' ? response.permitData.value : undefined,
    gasFeeToken0Approval: response.gasFeeToken0Approval,
    gasFeeToken1Approval: response.gasFeeToken1Approval,
    gasFeePositionTokenApproval: response.gasFeePositionTokenApproval,
    gasFeeToken0Cancel: response.gasFeeToken0Cancel,
    gasFeeToken1Cancel: response.gasFeeToken1Cancel,
    gasFeeToken0Permit: response.gasFeeToken0Permit,
    gasFeeToken1Permit: response.gasFeeToken1Permit,
  }
}

export interface TokenAddresses {
  token0Address?: string
  token1Address?: string
  positionTokenAddress?: string
}

// Matches each transaction to the correct token by comparing the transaction's `to` address
// against known token addresses in a single pass.
function normalizeV2Response(response: LPApprovalResponse, tokenAddresses: TokenAddresses): NormalizedApprovalData {
  let token0Approval: ApprovalTransactionRequest | undefined
  let token1Approval: ApprovalTransactionRequest | undefined
  let positionTokenApproval: ApprovalTransactionRequest | undefined
  let token0Cancel: ApprovalTransactionRequest | undefined
  let token1Cancel: ApprovalTransactionRequest | undefined
  // Permit transactions target the Permit2 contract, not the token contract,
  // so they can't be matched by `to` address. Collect them positionally instead.
  const permits: ApprovalTransactionRequest[] = []

  for (const tx of response.transactions) {
    const toAddress = tx.transaction?.to
    if (!toAddress) {
      continue
    }

    if (isPermitTransaction(tx)) {
      permits.push(tx)
    } else if (tx.cancelApproval) {
      if (tokenAddresses.token0Address && areEvmAddressesEqual(toAddress, tokenAddresses.token0Address)) {
        token0Cancel = tx
      } else if (tokenAddresses.token1Address && areEvmAddressesEqual(toAddress, tokenAddresses.token1Address)) {
        token1Cancel = tx
      }
    } else {
      if (tokenAddresses.positionTokenAddress && areEvmAddressesEqual(toAddress, tokenAddresses.positionTokenAddress)) {
        positionTokenApproval = tx
      } else if (tokenAddresses.token0Address && areEvmAddressesEqual(toAddress, tokenAddresses.token0Address)) {
        token0Approval = tx
      } else if (tokenAddresses.token1Address && areEvmAddressesEqual(toAddress, tokenAddresses.token1Address)) {
        token1Approval = tx
      }
    }
  }

  return {
    token0Approval: token0Approval?.transaction,
    token1Approval: token1Approval?.transaction,
    positionTokenApproval: positionTokenApproval?.transaction,
    token0Cancel: token0Cancel?.transaction,
    token1Cancel: token1Cancel?.transaction,
    token0PermitTransaction: permits[0]?.transaction,
    token1PermitTransaction: permits[1]?.transaction,
    v4BatchPermitData: response.v4BatchPermitData,
    v3NftPermitData: response.v3NftPermitData,
    gasFeeToken0Approval: token0Approval?.gasFee,
    gasFeeToken1Approval: token1Approval?.gasFee,
    gasFeePositionTokenApproval: positionTokenApproval?.gasFee,
    gasFeeToken0Cancel: token0Cancel?.gasFee,
    gasFeeToken1Cancel: token1Cancel?.gasFee,
    gasFeeToken0Permit: permits[0]?.gasFee,
    gasFeeToken1Permit: permits[1]?.gasFee,
  }
}

export function normalizeApprovalResponse(
  response: CheckApprovalLPResponse | LPApprovalResponse | undefined,
  tokenAddresses?: TokenAddresses,
): NormalizedApprovalData | undefined {
  if (!response) {
    return undefined
  }

  if (response instanceof CheckApprovalLPResponse) {
    return normalizeV1Response(response)
  }

  return normalizeV2Response(response, tokenAddresses ?? {})
}
