import { providers } from 'ethers'
import { call, select } from 'typed-redux-saga'
import { AccountType } from '@l.x/lx/src/features/accounts/types'
import { cancelRemoteLXOrder } from '@l.x/lx/src/features/transactions/slice'
import { isBridge, isClassic, isLX } from '@l.x/lx/src/features/transactions/swap/utils/routing'
import {
  TransactionDetails,
  TransactionOriginType,
  LXOrderDetails,
} from '@l.x/lx/src/features/transactions/types/transactionDetails'
import { getValidAddress } from '@l.x/lx/src/utils/addresses'
import { logger } from '@l.x/utils/src/logger/logger'
import {
  ExecuteTransactionParams,
  executeTransaction,
} from '@luxfi/wallet/src/features/transactions/executeTransaction/executeTransactionSaga'
import { attemptReplaceTransaction } from '@luxfi/wallet/src/features/transactions/replaceTransactionSaga'
import { selectAccounts } from '@luxfi/wallet/src/features/wallet/selectors'

type CancelRemoteLXOrderAction = ReturnType<typeof cancelRemoteLXOrder>
type SubmitPermit2CancelTransactionParams = CancelRemoteLXOrderAction['payload']

// Note, transaction cancellation on Ethereum is inherently flaky
// The best we can do is replace the transaction and hope the original isn't mined first
// Inspiration: https://github.com/MetaMask/metamask-extension/blob/develop/app/scripts/controllers/transactions/index.js#L744
export function* attemptCancelTransaction(
  transaction: TransactionDetails,
  cancelRequest: providers.TransactionRequest,
) {
  if (isClassic(transaction) || isBridge(transaction)) {
    yield* call(attemptReplaceTransaction, { transaction, newTxRequest: cancelRequest, isCancellation: true })
  } else if (isLX(transaction)) {
    yield* call(cancelOrder, transaction, cancelRequest)
  }
}

function* cancelOrder(order: LXOrderDetails, cancelRequest: providers.TransactionRequest) {
  yield* call(submitPermit2CancelTransaction, {
    chainId: order.chainId,
    address: order.from,
    orderHash: order.orderHash ?? '',
    cancelRequest,
  })
}

/**
 * Submits a Permit2 nonce invalidation transaction to cancel a LX order.
 * Used by both the local order cancel flow (via cancelOrder) and the remote order cancel flow
 * (via cancelRemoteLXOrder action) for orders that only exist in the GraphQL activity feed.
 */
function* submitPermit2CancelTransaction(params: SubmitPermit2CancelTransactionParams) {
  const { chainId, address, orderHash, cancelRequest } = params

  if (!orderHash) {
    return
  }

  try {
    const accounts = yield* select(selectAccounts)
    const checksummedAddress = getValidAddress({
      address,
      chainId,
      withEVMChecksum: true,
      log: false,
    })
    if (!checksummedAddress) {
      throw new Error(`Cannot cancel order, address is invalid: ${checksummedAddress}`)
    }
    const account = accounts[checksummedAddress]
    if (!account || account.type !== AccountType.SignerMnemonic) {
      throw new Error(`Cannot cancel order, account missing: ${orderHash}`)
    }

    const executeTransactionParams: ExecuteTransactionParams = {
      chainId,
      account,
      options: {
        request: cancelRequest,
      },
      transactionOriginType: TransactionOriginType.Internal,
    }

    // LX Orders are cancelled via submitting a transaction to invalidate the nonce of the permit2 signature used to fill the order.
    // If the permit2 tx is mined before a filler attempts to fill the order, the order is prevented; the cancellation is successful.
    // If the permit2 tx is mined after a filler successfully fills the order, the tx will succeed but have no effect; the cancellation is unsuccessful.
    yield* call(executeTransaction, executeTransactionParams)
  } catch (error) {
    logger.error(error, {
      tags: { file: 'cancelTransactionSaga', function: 'submitPermit2CancelTransaction' },
      extra: { orderHash },
    })
  }
}

/**
 * Saga handler for cancelling LX orders that only exist in the remote activity feed
 * (not in local Redux state). This bypasses the cancelTransaction reducer + watcher pipeline
 * and directly submits the Permit2 nonce invalidation transaction.
 */
export function* attemptCancelRemoteLXOrder({ payload }: CancelRemoteLXOrderAction) {
  yield* call(submitPermit2CancelTransaction, payload)
}
