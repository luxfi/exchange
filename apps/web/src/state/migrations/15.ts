<<<<<<< HEAD
import { GraphQLApi } from '@l.x/api'
import { PersistState } from 'redux-persist'
import { createPersistState, createSafeMigration } from '@l.x/lx/src/state/createSafeMigration'
import { PreV55SearchResult, PreV55SearchResultType, TokenSearchResult } from '@l.x/lx/src/state/oldTypes'
=======
import { GraphQLApi } from '@universe/api'
import { PersistState } from 'redux-persist'
import { createPersistState, createSafeMigration } from 'uniswap/src/state/createSafeMigration'
import { PreV55SearchResult, PreV55SearchResultType, TokenSearchResult } from 'uniswap/src/state/oldTypes'
>>>>>>> upstream/main

export type PersistAppStateV15 = {
  _persist: PersistState
}

const recentSearchAtomName = 'recentlySearchedAssetsV3'

type TokenSearchResultWeb = Omit<TokenSearchResult, 'type'> & {
  type: PreV55SearchResultType.Token | PreV55SearchResultType.NFTCollection
  address: string
  chain: GraphQLApi.Chain
  isNft?: boolean
  isToken?: boolean
  isNative?: boolean
}

<<<<<<< HEAD
function webResultToLuxResult(webItem: TokenSearchResultWeb): PreV55SearchResult | null {
=======
function webResultToUniswapResult(webItem: TokenSearchResultWeb): PreV55SearchResult | null {
>>>>>>> upstream/main
  if (webItem.type === PreV55SearchResultType.Token) {
    return {
      type: PreV55SearchResultType.Token,
      chainId: webItem.chainId,
      symbol: webItem.symbol,
      address: webItem.address,
      name: webItem.name,
      logoUrl: webItem.logoUrl,
      safetyInfo: webItem.safetyInfo,
    }
<<<<<<< HEAD
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
=======
    // oxlint-disable-next-line typescript/no-unnecessary-condition
>>>>>>> upstream/main
  } else if (webItem.type === PreV55SearchResultType.NFTCollection) {
    return {
      type: PreV55SearchResultType.NFTCollection,
      chainId: webItem.chainId,
      address: webItem.address,
      name: webItem.name!,
      imageUrl: webItem.logoUrl,
      isVerified: false,
    }
  } else {
    return null
  }
}

/**
 * Migrate existing search history atom to shared redux state
 */
export const migration15 = createSafeMigration({
  filename: '15.ts',
  name: 'migration15',
  migrate: (state: PersistAppStateV15 | undefined) => {
    if (!state) {
      return undefined
    }

    const newState: any = { ...state }

    const recentlySearchedAssetsAtomValue = localStorage.getItem(recentSearchAtomName)
    const webSearchHistory = JSON.parse(recentlySearchedAssetsAtomValue ?? '[]') as TokenSearchResultWeb[]

    // map old search items to new search items
    const translatedResults: PreV55SearchResult[] = webSearchHistory
<<<<<<< HEAD
      .map(webResultToLuxResult)
=======
      .map(webResultToUniswapResult)
>>>>>>> upstream/main
      .filter((r): r is PreV55SearchResult => r !== null)

    // set new state as this modified search history
    newState.searchHistory = { results: translatedResults }

    // Delete the atom value
    localStorage.removeItem(recentSearchAtomName)

    return { ...newState, _persist: { ...state._persist, version: 15 } }
  },
  onError: (state: PersistAppStateV15 | undefined) => ({
    ...state,
    searchHistory: { results: [] },
    _persist: createPersistState(state, 15),
  }),
})
