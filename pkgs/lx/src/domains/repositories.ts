import { checkWalletDelegation } from '@l.x/lx/src/data/apiClients/tradingApi/TradingApiClient'
import { createTradingApiDelegationRepository } from '@l.x/lx/src/features/smartWallet/delegation/createTradingApiDelegationRepository'
import type { DelegationRepository } from '@l.x/lx/src/features/smartWallet/delegation/delegationRepository'
import { getLogger } from '@l.x/utils/src/logger/logger'

export function getDelegationRepository(): DelegationRepository {
  return createTradingApiDelegationRepository({
    tradingApiClient: {
      checkWalletDelegation,
    },
    logger: getLogger(),
  })
}
