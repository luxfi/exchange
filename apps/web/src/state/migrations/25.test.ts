<<<<<<< HEAD
import { Language } from '@l.x/lx/src/features/language/constants'
import { testRemoveTHBFromCurrency } from '@l.x/lx/src/state/luxMigrationTests'
=======
import { Language } from 'uniswap/src/features/language/constants'
import { testRemoveTHBFromCurrency } from 'uniswap/src/state/uniswapMigrationTests'
>>>>>>> upstream/main
import { migration25 } from '~/state/migrations/25'

const previousState = {
  _persist: {
    version: 24,
    rehydrated: true,
  },
  userSettings: {
    currentCurrency: 'THB',
    currentLanguage: Language.English,
    hideSmallBalances: true,
    hideSpamTokens: true,
  },
}

describe('migration to v25', () => {
<<<<<<< HEAD
  // eslint-disable-next-line jest/expect-expect
=======
  // oxlint-disable-next-line jest/expect-expect
>>>>>>> upstream/main
  it('should set current currency to USD if it is THB', async () => {
    const thaiState = {
      ...previousState,
      userSettings: { currentCurrency: 'THB' },
    }
    testRemoveTHBFromCurrency(migration25, thaiState)
  })

<<<<<<< HEAD
  // eslint-disable-next-line jest/expect-expect
=======
  // oxlint-disable-next-line jest/expect-expect
>>>>>>> upstream/main
  it('should preserve non-THB currency settings if user currency is not set to THB', async () => {
    const japaneseState = {
      ...previousState,
      userSettings: { currentCurrency: 'JPY' },
    }
    testRemoveTHBFromCurrency(migration25, japaneseState)
  })
})
