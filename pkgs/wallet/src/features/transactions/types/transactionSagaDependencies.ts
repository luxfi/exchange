import type { TransactionRequest } from '@ethersproject/providers'
import type { SignerMnemonicAccountMeta } from 'lx/src/features/accounts/types'
import type { UniverseChainId } from 'lx/src/features/chains/types'
import type { sendAnalyticsEvent } from 'lx/src/features/telemetry/send'
import type { makeSelectAddressTransactions } from 'lx/src/features/transactions/selectors'
import type { transactionActions } from 'lx/src/features/transactions/slice'
import type { Logger } from 'utilities/src/logger/logger'
import type { PublicClient } from 'viem'
import type { ViemClientManager } from '@luxfi/wallet/src/features/providers/ViemClientManager'
import type { DelegationCheckResult } from '@luxfi/wallet/src/features/smartWallet/delegation/types'
import type { AnalyticsService } from '@luxfi/wallet/src/features/transactions/executeTransaction/services/analyticsService'
import type { FeatureFlagService } from '@luxfi/wallet/src/features/transactions/executeTransaction/services/featureFlagService'
import type {
  Provider,
  ProviderService,
} from '@luxfi/wallet/src/features/transactions/executeTransaction/services/providerService'
import type { TransactionRepository } from '@luxfi/wallet/src/features/transactions/executeTransaction/services/TransactionRepository/transactionRepository'
import type { TransactionService } from '@luxfi/wallet/src/features/transactions/executeTransaction/services/TransactionService/transactionService'
import type { TransactionSigner } from '@luxfi/wallet/src/features/transactions/executeTransaction/services/TransactionSignerService/transactionSignerService'
import type { TransactionConfigService } from '@luxfi/wallet/src/features/transactions/executeTransaction/services/transactionConfigService'
import type { TransactionExecutor } from '@luxfi/wallet/src/features/transactions/swap/services/transactionExecutor'
import type { TransactionParamsFactory } from '@luxfi/wallet/src/features/transactions/swap/services/transactionParamsFactory'
import type { BaseTransactionContext } from '@luxfi/wallet/src/features/transactions/swap/types/transactionExecutor'
import type { SignerMnemonicAccount } from '@luxfi/wallet/src/features/wallet/accounts/types'
import type { SignerManager } from '@luxfi/wallet/src/features/wallet/signing/SignerManager'
import type { RunSagaEffect } from '@luxfi/wallet/src/state/createSagaEffectRunner'

/**
 * Defines the type of delegation handling required for a transaction
 */
export enum DelegationType {
  /** Auto-detect delegation based on account and transaction properties */
  Auto = 'AUTO',
  /** Transaction should include delegation. Only used for swaps, when the transaction is already prepared with delegation */
  Delegate = 'DELEGATE',
  /** Transaction should remove delegation */
  RemoveDelegation = 'REMOVE_DELEGATION',
}

/**
 * Dependencies for transaction sagas - provides all services needed for executing transactions
 * across different transaction types (swaps, dapp transactions, etc.)
 */
export interface TransactionSagaDependencies {
  // Core service factories
  createProviderService: (params: { getSignerManager: () => SignerManager }) => ProviderService
  createTransactionConfigService: (params: {
    featureFlagService: FeatureFlagService
    logger: Logger
  }) => TransactionConfigService
  createTransactionSignerService: (params: {
    getAccount: () => SignerMnemonicAccountMeta
    getProvider: () => Promise<Provider>
    getSignerManager: () => SignerManager
  }) => TransactionSigner
  createBundledDelegationTransactionSignerService: (params: {
    delegationInfo: DelegationCheckResult
    getAccount: () => SignerMnemonicAccountMeta
    getProvider: () => Promise<Provider>
    getViemClient: () => Promise<PublicClient>
    getSignerManager: () => SignerManager
  }) => TransactionSigner
  createTransactionService: (params: {
    transactionRepository: TransactionRepository
    transactionSigner: TransactionSigner
    configService: TransactionConfigService
    analyticsService: AnalyticsService
    logger: Logger
    getProvider: () => Promise<Provider>
  }) => TransactionService
  createAnalyticsService: (params: {
    sendAnalyticsEvent: typeof sendAnalyticsEvent
    logger: Logger
  }) => AnalyticsService
  createTransactionRepository: (params: {
    actions: typeof transactionActions
    makeSelectAddressTransactions: () => ReturnType<typeof makeSelectAddressTransactions>
    logger: Logger
    runSagaEffect: RunSagaEffect
  }) => TransactionRepository
  createFeatureFlagService: () => FeatureFlagService
  createTransactionExecutor: (transactionService: TransactionService) => TransactionExecutor
  createTransactionParamsFactory: (context: BaseTransactionContext) => TransactionParamsFactory

  // External dependencies
  getViemClients: () => ViemClientManager
  getDelegationInfoForTransaction: (params: {
    delegationType: DelegationType
    activeAccount: SignerMnemonicAccount
    chainId: UniverseChainId
    transactionRequest?: TransactionRequest
    logger: Logger
  }) => Promise<DelegationCheckResult>
  logger: Logger
  sendAnalyticsEvent: typeof sendAnalyticsEvent
  transactionActions: typeof transactionActions
  makeSelectAddressTransactions: () => ReturnType<typeof makeSelectAddressTransactions>
  runSagaEffect: RunSagaEffect
}
