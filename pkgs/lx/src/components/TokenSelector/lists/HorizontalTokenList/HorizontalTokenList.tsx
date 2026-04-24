import { memo } from 'react'
import { TokenOption } from '@l.x/lx/src/components/lists/items/types'
import type { OnchainItemSection } from '@l.x/lx/src/components/lists/OnchainItemList/types'
import { OnSelectCurrency } from '@l.x/lx/src/components/TokenSelector/types'
import { PlatformSplitStubError } from '@l.x/utils/src/errors'

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
