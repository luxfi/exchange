import type { TypedDataDomain, TypedDataField } from '@ethersproject/abstract-signer'
import { TransactionStepType } from 'lx/src/features/transactions/steps/types'
import { ValidatedPermit } from 'lx/src/features/transactions/swap/utils/trade'

export interface SignTypedDataStepFields {
  domain: TypedDataDomain
  types: Record<string, TypedDataField[]>
  values: Record<string, unknown>
}

export interface Permit2SignatureStep extends SignTypedDataStepFields {
  type: TransactionStepType.Permit2Signature
}

export function createPermit2SignatureStep(permitData: ValidatedPermit): Permit2SignatureStep {
  return { type: TransactionStepType.Permit2Signature, ...permitData }
}
