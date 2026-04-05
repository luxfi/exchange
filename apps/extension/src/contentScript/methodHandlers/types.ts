<<<<<<< HEAD
import { DappResponseType } from '@l.x/lx/src/features/dappRequests/types'
=======
import { DappResponseType } from 'uniswap/src/features/dappRequests/types'
>>>>>>> upstream/main

export type PendingResponseInfo = {
  type: DappResponseType
  source: MessageEventSource | null
}
