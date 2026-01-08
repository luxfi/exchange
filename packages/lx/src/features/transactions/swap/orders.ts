import { TradingApi } from '@luxfi/api'
import { TradingApiClient } from 'lx/src/data/apiClients/tradingApi/TradingApiClient'

export async function getOrders(orderIds: string[]): Promise<TradingApi.GetOrdersResponse> {
  return await TradingApiClient.fetchOrders({ orderIds })
}
