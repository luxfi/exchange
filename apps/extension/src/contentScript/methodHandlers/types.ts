import { DappResponseType } from '@l.x/lx/src/features/dappRequests/types'

export type PendingResponseInfo = {
  type: DappResponseType
  source: MessageEventSource | null
}
