import { memo } from 'react'
import { TokenOption } from 'lx/src/components/lists/items/types'
import type { OnchainItemSection } from 'lx/src/components/lists/OnchainItemList/types'
import { OnSelectCurrency } from 'lx/src/components/TokenSelector/types'
import { PlatformSplitStubError } from 'utilities/src/errors'

export type HorizontalTokenListProps = {
  tokens: TokenOption[]
  onSelectCurrency: OnSelectCurrency
  index: number
  section: OnchainItemSection<TokenOption[]>
  expanded?: boolean
  onExpand?: (tokens: TokenOption[]) => void
}

export const HorizontalTokenList = memo(function HorizontalTokenList(_props: HorizontalTokenListProps): JSX.Element {
  throw new PlatformSplitStubError('HorizontalTokenList')
})
