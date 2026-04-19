import { TimePeriod } from '~/appGraphql/data/util'
import { TokenSortMethod } from '~/components/Tokens/constants'

/** Optional flat options for top tokens. When provided, used instead of Explore filter store (e.g. for TDP carousel). */
export type UseListTokensOptions = {
  sortMethod?: TokenSortMethod
  sortAscending?: boolean
  filterString?: string
  filterTimePeriod?: TimePeriod
}

export type UseListTokensSortOptions = Required<Pick<UseListTokensOptions, 'sortMethod' | 'sortAscending'>>

const DEFAULT_OPTIONS: Required<UseListTokensOptions> = {
  sortMethod: TokenSortMethod.VOLUME,
  sortAscending: false,
  filterString: '',
  filterTimePeriod: TimePeriod.DAY,
}

export function getEffectiveListTokensOptions(options?: UseListTokensOptions): Required<UseListTokensOptions> {
  const o = options ?? {}
  return {
    ...DEFAULT_OPTIONS,
    ...o,
  }
}
