import { AssetType } from 'lx/src/entities/assets'
import { UniverseChainId } from 'lx/src/features/chains/types'
import { CurrencyInfo } from 'lx/src/features/dataApi/types'
import { GQLNftAsset } from 'lx/src/features/nfts/types'
import { BaseDerivedInfo } from 'lx/src/features/transactions/types/baseDerivedInfo'
import { CurrencyField } from 'lx/src/types/currency'

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
