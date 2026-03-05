import { Flex, Text } from 'ui/src'
import { iconSizes } from 'ui/src/theme'
<<<<<<<< HEAD:packages/lx/src/features/transactions/swap/components/BridgingCurrencyRow.tsx
import { NetworkLogo } from 'lx/src/components/CurrencyLogo/NetworkLogo'
import { UniverseChainId } from 'lx/src/features/chains/types'
import { CurrencyInfo } from 'lx/src/features/dataApi/types'
import { getSymbolDisplayText } from 'lx/src/utils/currency'
========
import { NetworkLogo } from 'uniswap/src/components/CurrencyLogo/NetworkLogo'
import { UniverseChainId } from 'uniswap/src/features/chains/types'
>>>>>>>> upstream/main:packages/lx/src/features/transactions/swap/components/CrossChainCurrencyRow.tsx

export type CrossChainCurrencyRowProps = {
  inputChainId: UniverseChainId | null
  inputSymbol: string
  outputChainId: UniverseChainId | null
  outputSymbol: string
  formattedInputTokenAmount: string
  formattedOutputTokenAmount: string
}
/**
 * Component to display cross-chain transactions with two logos and currency amounts
 * 💶Token -> 💴Token
 */
export function CrossChainCurrencyRow({
  inputChainId,
  inputSymbol,
  outputChainId,
  outputSymbol,
  formattedInputTokenAmount,
  formattedOutputTokenAmount,
}: CrossChainCurrencyRowProps): JSX.Element {
  return (
    <Flex grow row py="$spacing2" gap="$spacing4" alignItems="center" flexWrap="wrap">
      <CurrencyAmount chainId={inputChainId} amount={formattedInputTokenAmount} symbol={inputSymbol} />
      <Text>→</Text>
      <CurrencyAmount chainId={outputChainId} amount={formattedOutputTokenAmount} symbol={outputSymbol} />
    </Flex>
  )
}

function CurrencyAmount({
  chainId,
  amount,
  symbol,
}: {
  chainId: UniverseChainId | null
  amount: string
  symbol: string
}): JSX.Element {
  return (
    <Flex row gap="$spacing4" alignItems="center">
      <NetworkLogo chainId={chainId} size={iconSizes.icon16} borderRadius={6} />
      <Text color="$neutral1" variant="body2">
        {amount}
        {symbol}
      </Text>
    </Flex>
  )
}
