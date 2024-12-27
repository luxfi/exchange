import { NATIVE_CHAIN_ID } from 'constants/tokens'
import { TokenQueryData } from 'graphql/data/Token'
import { TopToken } from 'graphql/data/TopTokens'
import { CHAIN_NAME_TO_CHAIN_ID } from 'graphql/data/util'

import AssetLogo, { AssetLogoBaseProps } from './AssetLogo'
import { SUPPORTED_CHAINS } from '@uniswap/smart-order-router'

import { supportedChainId } from 'utils/supportedChainId'

export default function QueryTokenLogo(
  props: AssetLogoBaseProps & {
    token?: any
  }
) {
  const chainId = props.token?.chain ? CHAIN_NAME_TO_CHAIN_ID[props.token?.chain] : undefined

  return (
    <AssetLogo
      isNative={(chainId == 200200 && props.token?.address == '0x4888e4a2ee0f03051c72d2bd3acf755ed3498b3e') ? true : props.token?.address === NATIVE_CHAIN_ID}
      chainId={chainId}
      address={props.token?.address}
      symbol={props.token?.symbol}
      backupImg={props.token?.project?.logoUrl}
      {...props}
    />
  )
}