import { DappResponseType } from '@luxexchange/lx/src/features/dappRequests/types'

export type PendingResponseInfo = {
  type: DappResponseType
  source: MessageEventSource | null
}
