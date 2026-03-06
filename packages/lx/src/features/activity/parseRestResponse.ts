import { ListTransactionsResponse } from '@lux/client-data-api/dist/data/v1/api_pb'
import { GraphQLApi } from '@universe/api'
import { extractOnRampTransactionDetails } from 'lx/src/features/activity/extract/extractFiatOnRampTransactionDetails'
import extractRestOnChainTransactionDetails from 'lx/src/features/activity/extract/extractOnChainTransactionDetails'
import extractPlanDetails from 'lx/src/features/activity/extract/extractPlanDetails'
import extractRestFiatOnRampDetails from 'lx/src/features/activity/extract/extractRestFiatOnRampDetails'
import extractRestDEXOrderDetails from 'lx/src/features/activity/extract/extractRestDEXOrderDetails'
import extractTransactionDetails from 'lx/src/features/activity/extract/extractTransactionDetails'
import { extractDEXOrderDetails } from 'lx/src/features/activity/extract/extractDEXOrderDetails'
import { getIsNftHidden } from 'lx/src/features/nfts/utils'
import {
  TransactionDetails,
  TransactionDetailsType,
  TransactionListQueryResponse,
  TransactionType,
} from 'lx/src/features/transactions/types/transactionDetails'
import { CurrencyIdToVisibility, NFTKeyToVisibility } from 'lx/src/features/visibility/slice'
import { CurrencyId } from 'lx/src/types/currency'
import { buildCurrencyId } from 'lx/src/utils/currencyId'
import { logger } from 'utilities/src/logger/logger'

// Flag to prevent spamming logs when multiple transactions are missing the transaction field
let hasLoggedMissingTransactionField = false

export enum RestTransactionType {
  OnChain = 'onChain',
  DEX = 'dex',
  FiatOnRamp = 'fiatOnRamp',
  Plan = 'plan',
}

/**
 * Transforms api txn data to formatted TransactionDetails array
 * @param data Transaction history data response
 */
export function parseDataResponseToTransactionDetails({
  data,
  hideSpamTokens,
  nftVisibility,
  tokenVisibilityOverrides,
}: {
  data: GraphQLApi.TransactionListQuery
  hideSpamTokens: boolean
  nftVisibility?: NFTKeyToVisibility
  tokenVisibilityOverrides?: CurrencyIdToVisibility
}): TransactionDetails[] | undefined {
  if (data.portfolios?.[0]?.assetActivities) {
    return data.portfolios[0].assetActivities.reduce((accum: TransactionDetails[], t) => {
      if (t?.details.__typename === TransactionDetailsType.Transaction) {
        const parsed = extractTransactionDetails(t as TransactionListQueryResponse)
        const isSpam = parsed?.typeInfo.isSpam
        const currencyId = extractCurrencyIdFromTx(parsed)
        const spamOverride = currencyId ? tokenVisibilityOverrides?.[currencyId]?.isVisible : false
        const isNFTSpam = isNftTransactionHidden({ parsed, nftVisibility, isSpam })

        if (parsed && !(hideSpamTokens && isSpam && !spamOverride) && !isNFTSpam) {
          accum.push(parsed)
        }
      } else if (t?.details.__typename === TransactionDetailsType.OnRamp) {
        const parsed = extractOnRampTransactionDetails(t as TransactionListQueryResponse)
        if (parsed) {
          accum.push(parsed)
        }
      } else if (t?.details.__typename === TransactionDetailsType.DEXOrder) {
        const parsed = extractDEXOrderDetails(t as TransactionListQueryResponse)
        if (parsed) {
          accum.push(parsed)
        }
      }

      return accum
    }, [])
  }
  return undefined
}

export function parseRestResponseToTransactionDetails({
  data,
  hideSpamTokens,
  nftVisibility,
  tokenVisibilityOverrides,
}: {
  data: ListTransactionsResponse
  hideSpamTokens: boolean
  nftVisibility?: NFTKeyToVisibility
  tokenVisibilityOverrides?: CurrencyIdToVisibility
}): TransactionDetails[] | undefined {
  return data.transactions.reduce((accum: TransactionDetails[], transaction) => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!transaction.transaction) {
      if (!hasLoggedMissingTransactionField) {
        hasLoggedMissingTransactionField = true
        logger.error(new Error('Received transaction with missing transaction field'), {
          tags: { file: 'parseRestResponse', function: 'parseRestResponseToTransactionDetails' },
          extra: { transaction },
        })
      }
      return accum
    }
    switch (transaction.transaction.case) {
      case RestTransactionType.OnChain: {
        const parsedTransactions = extractRestOnChainTransactionDetails(transaction.transaction.value)
        // Handle array of transactions (e.g., EXECUTE label can return multiple)
        for (const parsed of parsedTransactions) {
          const isSpam = parsed.typeInfo.isSpam
          const currencyId = extractCurrencyIdFromTx(parsed)
          const spamOverride = currencyId ? tokenVisibilityOverrides?.[currencyId]?.isVisible : false
          const isNFTSpam = isNftTransactionHidden({ parsed, nftVisibility, isSpam })
          if (!(hideSpamTokens && isSpam && !spamOverride) && !isNFTSpam) {
            accum.push(parsed)
          }
        }
        break
      }
      case RestTransactionType.DEX: {
        const parsed = extractRestDEXOrderDetails(transaction.transaction.value)
        if (parsed) {
          accum.push(parsed)
        }
        break
      }
      case RestTransactionType.FiatOnRamp: {
        const parsed = extractRestFiatOnRampDetails(transaction.transaction.value)
        if (parsed) {
          accum.push(parsed)
        }
        break
      }
      case RestTransactionType.Plan: {
        const parsed = extractPlanDetails(transaction.transaction.value)
        if (parsed) {
          accum.push(parsed)
        }
        break
      }
    }
    return accum
  }, [])
}

function isNftTransactionHidden({
  parsed,
  nftVisibility,
  isSpam = false,
}: {
  parsed: TransactionDetails | null
  nftVisibility?: NFTKeyToVisibility
  isSpam?: boolean
}): boolean {
  if (parsed?.typeInfo && 'nftSummaryInfo' in parsed.typeInfo && nftVisibility) {
    const nftSummaryInfo = parsed.typeInfo.nftSummaryInfo

    return nftSummaryInfo
      ? getIsNftHidden({
          contractAddress: nftSummaryInfo.address,
          tokenId: nftSummaryInfo.tokenId,
          isSpam,
          nftVisibility,
        })
      : false
  }
  return false
}

function extractCurrencyIdFromTx(transaction: TransactionDetails | null): CurrencyId | undefined {
  if (!transaction) {
    return undefined
  }

  if (
    transaction.typeInfo.type === TransactionType.Approve ||
    transaction.typeInfo.type === TransactionType.Send ||
    transaction.typeInfo.type === TransactionType.Receive
  ) {
    return buildCurrencyId(transaction.chainId, transaction.typeInfo.tokenAddress)
  }

  if (transaction.typeInfo.type === TransactionType.Swap) {
    // We only care about output currency because that's the net new asset
    return transaction.typeInfo.outputCurrencyId
  }

  return undefined
}
