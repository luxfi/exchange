import { migration60 } from 'state/migrations/60'
import { USDC } from 'lx/src/constants/tokens'
import { UniverseChainId } from 'lx/src/features/chains/types'
import { testMigrateDismissedTokenWarnings } from 'lx/src/state/uniswapMigrationTests'

const previousState = {
  _persist: {
    version: 59,
    rehydrated: true,
  },
  tokens: {
    dismissedTokenWarnings: {
      [UniverseChainId.Mainnet]: {
        [USDC.address]: { chainId: UniverseChainId.Mainnet, address: USDC.address },
      },
    },
  },
}

describe('migration to v60', () => {
  it('should change dismissed token warnings to non default', async () => {
    const result = migration60(previousState)
    expect(result?._persist.version).toEqual(60)
    testMigrateDismissedTokenWarnings(migration60, previousState)
  })
})
