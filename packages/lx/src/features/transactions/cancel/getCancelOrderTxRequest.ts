import { providers } from 'ethers/lib/ethers'
import { buildSingleCancellation } from 'lx/src/features/transactions/cancel/cancelOrderFactory'
import { getOrders } from 'lx/src/features/transactions/swap/orders'
import { UniswapXOrderDetails } from 'lx/src/features/transactions/types/transactionDetails'

export async function getCancelOrderTxRequest(tx: UniswapXOrderDetails): Promise<providers.TransactionRequest | null> {
  const { orderHash, chainId, from, routing } = tx
  if (!orderHash) {
    return null
  }

  const { encodedOrder } = (await getOrders([orderHash])).orders[0] ?? {}
  if (!encodedOrder) {
    return null
  }

  return buildSingleCancellation(
    {
      encodedOrder,
      routing,
      chainId,
      orderHash,
    },
    from,
  )
}
