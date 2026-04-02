import { TradingApi } from '@luxexchange/api'
import ms from 'ms'
import { useCallback, useEffect, useMemo } from 'react'
import { TradingApiClient } from '@luxexchange/lx/src/data/apiClients/tradingApi/TradingApiClient'
import { getChainInfo } from '@luxexchange/lx/src/features/chains/chainInfo'
import { RetryOptions, UniverseChainId } from '@luxexchange/lx/src/features/chains/types'
import { InterfaceEventName } from '@luxexchange/lx/src/features/telemetry/constants'
import { sendAnalyticsEvent } from '@luxexchange/lx/src/features/telemetry/send'
import { checkedTransaction } from '@luxexchange/lx/src/features/transactions/slice'
import { isLxSwap } from '@luxexchange/lx/src/features/transactions/swap/utils/routing'
import { toTradingApiSupportedChainId } from '@luxexchange/lx/src/features/transactions/swap/utils/tradingApi'
import { TransactionReceipt, TransactionStatus } from '@luxexchange/lx/src/features/transactions/types/transactionDetails'
import { receiptFromViemReceipt } from '@luxexchange/lx/src/features/transactions/utils/receipt'
import { shouldCheckTransaction } from '@luxexchange/lx/src/utils/polling'
import { isValidHexString } from '@luxfi/utilities/src/addresses/hex'
import { usePublicClient } from 'wagmi'
import { useAccount } from '~/hooks/useAccount'
import useCurrentBlockTimestamp from '~/hooks/useCurrentBlockTimestamp'
import useBlockNumber from '~/lib/hooks/useBlockNumber'
import { CanceledError, RetryableError, retry } from '~/state/activity/polling/retry'
import { ActivityUpdateTransactionType, OnActivityUpdate } from '~/state/activity/types'
import { useAppDispatch } from '~/state/hooks'
import { useMultichainTransactions, useTransactionRemover } from '~/state/transactions/hooks'
import { PendingTransactionDetails } from '~/state/transactions/types'
import { isPendingTx } from '~/state/transactions/utils'

interface ReceiptWithStatus {
  status: 'success' | 'reverted'
  receipt: TransactionReceipt
}

function usePendingTransactions(chainId?: UniverseChainId): PendingTransactionDetails[] {
  const multichainTransactions = useMultichainTransactions()
  return useMemo(() => {
    if (!chainId) {
      return []
    }
    return multichainTransactions.flatMap(([tx, txChainId]) => {
      // Avoid polling for already-deposited bridge transactions, as they will be finalized by the bridge updater.
      // Also avoid polling DEX orders, as they are polled by usePollPendingOrders using the DEX backend API.
      if (isPendingTx(tx, /* skipDepositedBridgeTxs = */ true) && txChainId === chainId && !isLxSwap(tx)) {
        // Ignore batch txs which need to be polled against wallet instead of chain.
        return tx.batchInfo ? [] : [tx]
      }
      return []
    })
  }, [chainId, multichainTransactions])
}

const SWAP_STATUS_TO_FINALIZED_STATUS: Partial<Record<TradingApi.SwapStatus, 'success' | 'reverted'>> = {
  [TradingApi.SwapStatus.SUCCESS]: 'success',
  [TradingApi.SwapStatus.FAILED]: 'reverted',
  [TradingApi.SwapStatus.EXPIRED]: 'reverted',
}

export function usePollPendingTransactions(onActivityUpdate: OnActivityUpdate) {
  const account = useAccount()
  const publicClient = usePublicClient()

  const pendingTransactions = usePendingTransactions(account.chainId)
  const hasPending = pendingTransactions.length > 0
  const blockTimestamp = useCurrentBlockTimestamp({ refetchInterval: !hasPending ? false : undefined })

  const lastBlockNumber = useBlockNumber()
  const removeTransaction = useTransactionRemover()
  const dispatch = useAppDispatch()

  const getReceiptWithTradingApi = useCallback(
    (tx: PendingTransactionDetails): { promise: Promise<ReceiptWithStatus>; cancel: () => void } => {
      const chainId = toTradingApiSupportedChainId(account.chainId)
      if (!account.chainId || !chainId) {
        throw new Error('No chainId')
      }

      const pollingInterval = getChainInfo(account.chainId).tradingApiPollingIntervalMs
      const retryOptions: RetryOptions = {
        n: 20,
        minWait: pollingInterval,
        medWait: pollingInterval,
        maxWait: pollingInterval,
      }

      return retry(() => {
        if (!tx.hash) {
          throw new Error(`Invalid transaction hash: hash not defined`)
        }
        return TradingApiClient.fetchSwaps({ txHashes: [tx.hash], chainId })
          .then(async (res) => {
            const status = res.swaps?.[0]?.status
            const finalizedStatus = status ? SWAP_STATUS_TO_FINALIZED_STATUS[status] : undefined

            if (!finalizedStatus) {
              if (account.isConnected) {
                // Remove transactions past their deadline or - if there is no deadline - older than 6 hours.
                if (tx.deadline) {
                  // Deadlines are expressed as seconds since epoch, as they are used on-chain.
                  if (blockTimestamp && tx.deadline < Number(blockTimestamp)) {
                    removeTransaction(tx.id)
                  }
                } else if (tx.addedTime + ms(`6h`) < Date.now()) {
                  removeTransaction(tx.id)
                }
              }

              throw new RetryableError()
            }

            sendAnalyticsEvent(InterfaceEventName.SwapConfirmedOnClient, {
              time: Date.now() - tx.addedTime,
              swap_success: finalizedStatus === 'success',
              success: finalizedStatus === 'success',
              chainId: account.chainId,
              txHash: tx.hash ?? '',
              transactionType: tx.typeInfo.type,
              routing: 'classic',
            })

            let adaptedReceipt: TransactionReceipt | undefined

            if (publicClient && tx.hash && isValidHexString(tx.hash)) {
              try {
                const viemReceipt = await publicClient.getTransactionReceipt({ hash: tx.hash })
                adaptedReceipt = receiptFromViemReceipt(viemReceipt)
                if (!adaptedReceipt) {
                  throw new Error('Error converting viem receipt to transaction receipt')
                }
              } catch {
                // ignore errors and fallback to dummy
              }
            }

            if (!adaptedReceipt) {
              adaptedReceipt = {
                transactionIndex: 0,
                blockHash: tx.hash ?? '',
                blockNumber: 0,
                confirmedTime: Date.now(),
                gasUsed: 0,
                effectiveGasPrice: 0,
              }
            }

            return { status: finalizedStatus, receipt: adaptedReceipt } as ReceiptWithStatus
          })
          .catch((_error) => {
            throw new RetryableError()
          })
      }, retryOptions) as { promise: Promise<ReceiptWithStatus>; cancel: () => void }
    },
    [account.chainId, account.isConnected, blockTimestamp, removeTransaction, publicClient],
  )

  useEffect(() => {
    if (!account.address || !account.chainId || !publicClient || !lastBlockNumber || !hasPending) {
      return undefined
    }

    const cancels = pendingTransactions
      .filter((tx) => shouldCheckTransaction(lastBlockNumber, tx))
      .map((tx) => {
        const { promise, cancel } = getReceiptWithTradingApi(tx)
        promise
          .then(({ status, receipt }) => {
            if (!account.chainId) {
              return
            }
            onActivityUpdate({
              type: ActivityUpdateTransactionType.BaseTransaction,
              chainId: account.chainId,
              original: tx,
              update: {
                status: status === 'success' ? TransactionStatus.Success : TransactionStatus.Failed,
                typeInfo: tx.typeInfo,
                receipt,
                hash: tx.hash,
                networkFee: tx.networkFee,
              },
            })
          })
          .catch((error) => {
            if (error instanceof CanceledError || !account.chainId) {
              return
            }
            dispatch(
              checkedTransaction({
                chainId: account.chainId!,
                id: tx.id,
                address: account.address!,
                blockNumber: lastBlockNumber,
              }),
            )
          })
        return cancel
      })

    return () => {
      cancels.forEach((cancel) => cancel())
    }
  }, [
    account.address,
    account.chainId,
    publicClient,
    lastBlockNumber,
    pendingTransactions,
    hasPending,
    dispatch,
    onActivityUpdate,
    getReceiptWithTradingApi,
  ])
}
