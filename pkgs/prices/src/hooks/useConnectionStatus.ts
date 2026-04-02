import { usePricesContext } from '@l.x/prices/src/context/PriceServiceContext'
import type { ConnectionStatus } from '@l.x/websocket'
import { useSyncExternalStore } from 'react'

/**
 * Hook to get the current WebSocket connection status.
 */
export function useConnectionStatus(): ConnectionStatus {
  const { wsClient } = usePricesContext()
  return useSyncExternalStore(wsClient.onStatusChange, wsClient.getConnectionStatus, wsClient.getConnectionStatus)
}
