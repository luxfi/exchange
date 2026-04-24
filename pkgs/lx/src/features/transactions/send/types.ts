import { AssetType } from '@l.x/lx/src/entities/assets'
import { UniverseChainId } from '@l.x/lx/src/features/chains/types'
import { CurrencyInfo } from '@l.x/lx/src/features/dataApi/types'
import { GQLNftAsset } from '@l.x/lx/src/features/nfts/types'
import { BaseDerivedInfo } from '@l.x/lx/src/features/transactions/types/baseDerivedInfo'
import { CurrencyField } from '@l.x/lx/src/types/currency'

export type DerivedSendInfo = BaseDerivedInfo<CurrencyInfo | GQLNftAsset> & {
  currencyTypes: { [CurrencyField.INPUT]?: AssetType }
  currencyInInfo?: CurrencyInfo | null
  chainId: UniverseChainId
  exactAmountFiat: string
  exactCurrencyField: CurrencyField.INPUT
  isFiatInput?: boolean
  nftIn: GQLNftAsset | undefined
  recipient?: string
  txId?: string
}
