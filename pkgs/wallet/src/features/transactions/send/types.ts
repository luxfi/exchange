import { Currency, CurrencyAmount } from '@luxamm/sdk-core'
import { GasEstimate } from '@l.x/api'
import { AssetType, NFTAssetType } from 'lx/src/entities/assets'
import { SignerMnemonicAccountMeta } from 'lx/src/features/accounts/types'
import { UniverseChainId } from 'lx/src/features/chains/types'

interface BaseSendParams {
  type: AssetType
  txId?: string
  account: SignerMnemonicAccountMeta
  chainId: UniverseChainId
  toAddress: Address
  tokenAddress: Address
  currencyAmountUSD?: Maybe<CurrencyAmount<Currency>> // for analytics
  gasEstimate?: GasEstimate
}

export interface SendCurrencyParams extends BaseSendParams {
  type: AssetType.Currency
  amountInWei: string
}

export interface SendNFTParams extends BaseSendParams {
  type: NFTAssetType
  tokenId: string
}

export type SendTokenParams = SendCurrencyParams | SendNFTParams
