import { Currency } from '@uniswap/sdk-core'
import { TokenInfo } from '@uniswap/token-lists'
import { CHAIN_NAME_TO_CHAIN_ID } from 'graphql/data/util'

import AssetLogo, { AssetLogoBaseProps } from './AssetLogo'

export default function CurrencyLogo(
  props: AssetLogoBaseProps & {
    currency?: Currency | null
  }
) {
  //must remove
  const chainId = props.currency?.chainId

  return (
    <AssetLogo
      isNative={(chainId == 200200 && props.currency?.symbol == 'WLUX') ? true : props.currency?.isNative} //must edit
      chainId={props.currency?.chainId}
      address={props.currency?.wrapped.address}
      symbol={props.symbol ?? props.currency?.symbol}
      backupImg={(props.currency as TokenInfo)?.logoURI}
      hideL2Icon={props.hideL2Icon ?? true}
      {...props}
    />
  )
}