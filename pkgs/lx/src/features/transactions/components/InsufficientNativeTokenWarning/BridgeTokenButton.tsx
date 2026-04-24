import { useTranslation } from 'react-i18next'
import { Button, Flex } from '@l.x/ui/src'
import { validColor } from '@l.x/ui/src/theme'
import { useLuxContext } from '@l.x/lx/src/contexts/LuxContext'
import { CurrencyInfo } from '@l.x/lx/src/features/dataApi/types'
import { ElementName } from '@l.x/lx/src/features/telemetry/constants'
import Trace from '@l.x/lx/src/features/telemetry/Trace'
import { useNetworkColors } from '@l.x/lx/src/utils/colors'

export function BridgeTokenButton({
  inputToken,
  outputToken,
  outputNetworkName,
  onPress,
}: {
  inputToken: CurrencyInfo
  outputToken: CurrencyInfo
  outputNetworkName: string
  onPress?: () => void
}): JSX.Element {
  const { t } = useTranslation()
  const { foreground } = useNetworkColors(outputToken.currency.chainId)
  const primaryColor = validColor(foreground)

  const { navigateToSwapFlow } = useLuxContext()

  const onPressBridgeToken = (): void => {
    onPress?.()
    navigateToSwapFlow({
      inputCurrencyId: inputToken.currencyId,
      outputCurrencyId: outputToken.currencyId,
    })
  }

  if (!outputToken.currency.symbol) {
    throw new Error(
      'Unexpected render of `BridgeTokenButton` without a token symbol for currency ' + outputToken.currencyId,
    )
  }

  return (
    <Trace logPress element={ElementName.BuyNativeTokenButton}>
      <Flex row alignSelf="stretch">
        <Button
          backgroundColor="$accent1"
          borderColor="$transparent"
          hoverStyle={{
            borderColor: primaryColor,
          }}
          size="medium"
          emphasis="text-only"
          primary-color={primaryColor}
          onPress={onPressBridgeToken}
        >
          <Button.Text color="$white">
            {t('swap.warning.insufficientGas.button.bridge', {
              tokenSymbol: outputToken.currency.symbol,
              networkName: outputNetworkName,
            })}
          </Button.Text>
        </Button>
      </Flex>
    </Trace>
  )
}
