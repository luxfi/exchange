import { DappResponseType } from 'lx/src/features/dappRequests/types'

export type PendingResponseInfo = {
  type: DappResponseType
  source: MessageEventSource | null
}
