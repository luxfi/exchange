import { useTranslation } from 'react-i18next'
import { AppStackScreenProp } from 'src/app/navigation/types'
import { useReactNavigationModal } from 'src/components/modals/useReactNavigationModal'
import { ReceiveButton } from 'src/components/TokenDetails/ReceiveButton'
import { Flex, Text } from 'ui/src'
import { iconSizes } from 'ui/src/theme'
import { CurrencyLogo } from 'lx/src/components/CurrencyLogo/CurrencyLogo'
import { Modal } from 'lx/src/components/modals/Modal'
import { LearnMoreLink } from 'lx/src/components/text/LearnMoreLink'
import { uniswapUrls } from 'lx/src/constants/urls'
import { useBridgingTokenWithHighestBalance } from 'lx/src/features/bridging/hooks/tokens'
import { getChainInfo } from 'lx/src/features/chains/chainInfo'
import { UniverseChainId } from 'lx/src/features/chains/types'
import { ModalName } from 'lx/src/features/telemetry/constants'
import { useCurrencyInfo, useNativeCurrencyInfo } from 'lx/src/features/tokens/useCurrencyInfo'
import { BridgeTokenButton } from 'lx/src/features/transactions/components/InsufficientNativeTokenWarning/BridgeTokenButton'
import { BuyNativeTokenButton } from 'lx/src/features/transactions/components/InsufficientNativeTokenWarning/BuyNativeTokenButton'
import { currencyIdToAddress } from 'lx/src/utils/currencyId'
import { useActiveAccountAddress } from 'wallet/src/features/wallet/hooks'

export function BuyNativeTokenModal({
  route,
}: AppStackScreenProp<typeof ModalName.BuyNativeToken>): JSX.Element | null {
  const { chainId, currencyId } = route.params
  const { t } = useTranslation()
  const activeAddress = useActiveAccountAddress()
  const nativeCurrencyInfo = useNativeCurrencyInfo(chainId)
  const currencyInfo = useCurrencyInfo(currencyId)
  const { onClose } = useReactNavigationModal()

  const { data: bridgingTokenWithHighestBalance } = useBridgingTokenWithHighestBalance({
    evmAddress: activeAddress ?? '',
    currencyAddress: currencyIdToAddress(nativeCurrencyInfo?.currencyId ?? ''),
    currencyChainId: chainId,
  })

  if (!nativeCurrencyInfo || !currencyInfo) {
    return null
  }

  const isMainnet = chainId === UniverseChainId.Mainnet
  const chainName = getChainInfo(chainId).label
  const nativeTokenSymbol = nativeCurrencyInfo.currency.symbol ?? ''
  const nativeTokenName = nativeCurrencyInfo.currency.name ?? ''
  const tokenSymbol = currencyInfo.currency.symbol ?? ''

  return (
    <Modal isDismissible alignment="top" name={ModalName.BuyNativeToken} onClose={onClose}>
      <Flex centered gap="$spacing24" px="$spacing24" py="$spacing12">
        <Flex centered gap="$spacing16">
          <CurrencyLogo currencyInfo={nativeCurrencyInfo} size={iconSizes.icon48} />
          <Flex centered gap="$spacing8">
            <Text variant="subheading1">
              {isMainnet
                ? t('token.zeroNativeBalance.title.mainnet', { nativeTokenName })
                : t('token.zeroNativeBalance.title.otherChains', { nativeTokenName, chainName })}
            </Text>
            <Text color="$neutral2" textAlign="center" variant="body3" px="$spacing8">
              {t('token.zeroNativeBalance.subtitle', { tokenSymbol })}
            </Text>
            <Text color="$neutral2" textAlign="center" variant="body3" px="$spacing8">
              {isMainnet
                ? t('token.zeroNativeBalance.description.mainnet', { tokenSymbol })
                : t('token.zeroNativeBalance.description.otherChains', {
                    tokenSymbol,
                    nativeTokenSymbol,
                    chainName,
                  })}
            </Text>
          </Flex>
          <LearnMoreLink
            textColor="$accent3"
            textVariant="buttonLabel3"
            url={uniswapUrls.helpArticleUrls.networkFeeInfo}
          />
        </Flex>
        <Flex centered gap="$spacing8" width="100%">
          {bridgingTokenWithHighestBalance && (
            <BridgeTokenButton
              inputToken={bridgingTokenWithHighestBalance.currencyInfo}
              outputToken={nativeCurrencyInfo}
              outputNetworkName={chainName}
              onPress={onClose}
            />
          )}
          <BuyNativeTokenButton
            usesStaticText
            usesStaticTheme={false}
            nativeCurrencyInfo={nativeCurrencyInfo}
            onPress={onClose}
          />
          {!bridgingTokenWithHighestBalance && <ReceiveButton onPress={onClose} />}
        </Flex>
      </Flex>
    </Modal>
  )
}
