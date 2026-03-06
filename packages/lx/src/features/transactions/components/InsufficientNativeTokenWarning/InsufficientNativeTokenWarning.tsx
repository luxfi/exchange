import { Currency } from '@uniswap/sdk-core'
import { GasFeeResult } from '@universe/api'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Flex, Text, TouchableArea } from 'ui/src'
import { CurrencyLogo } from 'lx/src/components/CurrencyLogo/CurrencyLogo'
import { Warning } from 'lx/src/components/modals/WarningModal/types'
import { WarningModal } from 'lx/src/components/modals/WarningModal/WarningModal'
import { LearnMoreLink } from 'lx/src/components/text/LearnMoreLink'
import { luxUrls } from 'lx/src/constants/urls'
import { useActiveAddresses } from 'lx/src/features/accounts/store/hooks'
import type { AddressGroup } from 'lx/src/features/accounts/store/types/AccountsState'
import { useBridgingTokenWithHighestBalance } from 'lx/src/features/bridging/hooks/tokens'
import { useEnabledChains } from 'lx/src/features/chains/hooks/useEnabledChains'
import { UniverseChainId } from 'lx/src/features/chains/types'
import { CurrencyInfo } from 'lx/src/features/dataApi/types'
import { ModalName } from 'lx/src/features/telemetry/constants'
import { BridgeTokenButton } from 'lx/src/features/transactions/components/InsufficientNativeTokenWarning/BridgeTokenButton'
import { BuyNativeTokenButton } from 'lx/src/features/transactions/components/InsufficientNativeTokenWarning/BuyNativeTokenButton'
import { InsufficientNativeTokenBaseComponent } from 'lx/src/features/transactions/components/InsufficientNativeTokenWarning/InsufficientNativeTokenBaseComponent'
import { useInsufficientNativeTokenWarning } from 'lx/src/features/transactions/components/InsufficientNativeTokenWarning/useInsufficientNativeTokenWarning'
import { currencyIdToAddress } from 'lx/src/utils/currencyId'
import { logger } from 'utilities/src/logger/logger'
import { isExtensionApp, isWebPlatform } from 'utilities/src/platform'

export function InsufficientNativeTokenWarning({
  warnings,
  flow,
  gasFee,
}: {
  warnings: Warning[]
  flow: 'send' | 'swap'
  gasFee: GasFeeResult
}): JSX.Element | null {
  const parsedInsufficientNativeTokenWarning = useInsufficientNativeTokenWarning({
    warnings,
    flow,
    gasFee,
  })

  const { nativeCurrency, nativeCurrencyInfo } = parsedInsufficientNativeTokenWarning ?? {}

  const addresses = useActiveAddresses()

  if (!parsedInsufficientNativeTokenWarning || !nativeCurrencyInfo || !nativeCurrency) {
    return null
  }

  if (!addresses.evmAddress && !addresses.svmAddress) {
    logger.error(new Error('Unexpected render of `InsufficientNativeTokenWarning` without an active address'), {
      tags: {
        file: 'InsufficientNativeTokenWarning.tsx',
        function: 'InsufficientNativeTokenWarning',
      },
    })
    return null
  }

  return (
    <InsufficientNativeTokenWarningContent
      addresses={addresses}
      parsedInsufficientNativeTokenWarning={parsedInsufficientNativeTokenWarning}
      nativeCurrencyInfo={nativeCurrencyInfo}
      nativeCurrency={nativeCurrency}
      gasFee={gasFee}
    />
  )
}

function InsufficientNativeTokenWarningContent({
  addresses,
  parsedInsufficientNativeTokenWarning,
  nativeCurrencyInfo,
  nativeCurrency,
  gasFee,
}: {
  addresses: AddressGroup
  parsedInsufficientNativeTokenWarning: NonNullable<ReturnType<typeof useInsufficientNativeTokenWarning>>
  nativeCurrencyInfo: CurrencyInfo
  nativeCurrency: Currency
  gasFee: GasFeeResult
}): JSX.Element {
  const { t } = useTranslation()
  const [showModal, setShowModal] = useState(false)
  const { isTestnetModeEnabled } = useEnabledChains()

  const { networkName, modalOrTooltipMainMessage } = parsedInsufficientNativeTokenWarning

  const currencyAddress = currencyIdToAddress(nativeCurrencyInfo.currencyId)

  const { data: bridgingTokenWithHighestBalance } = useBridgingTokenWithHighestBalance({
    ...addresses,
    currencyAddress,
    currencyChainId: nativeCurrencyInfo.currency.chainId,
  })

  const shouldShowNetworkName = nativeCurrency.symbol === 'ETH' && nativeCurrency.chainId !== UniverseChainId.Mainnet

  const onClose = (): void => {
    setShowModal(false)
  }

  return (
    <>
      <TouchableArea onPress={(): void => setShowModal(true)}>
        <InsufficientNativeTokenBaseComponent
          parsedInsufficientNativeTokenWarning={parsedInsufficientNativeTokenWarning}
        />
      </TouchableArea>

      {showModal && (
        <WarningModal
          isOpen
          backgroundIconColor={false}
          icon={<CurrencyLogo currencyInfo={nativeCurrencyInfo} />}
          modalName={ModalName.SwapWarning}
          title={
            shouldShowNetworkName
              ? t('transaction.warning.insufficientGas.modal.title.withNetwork', {
                  tokenSymbol: nativeCurrency.symbol,
                  networkName,
                })
              : t('transaction.warning.insufficientGas.modal.title.withoutNetwork', {
                  tokenSymbol: nativeCurrency.symbol ?? '',
                })
          }
          showCloseButton={isExtensionApp || isWebPlatform}
          onClose={onClose}
        >
          <Text color="$neutral2" textAlign="center" variant="body3">
            {modalOrTooltipMainMessage}
          </Text>

          <Flex row py="$spacing12">
            <LearnMoreLink
              textColor="$accent3"
              textVariant="buttonLabel3"
              url={luxUrls.helpArticleUrls.networkFeeInfo}
            />
          </Flex>

          <Flex width="100%" gap="$spacing12">
            {bridgingTokenWithHighestBalance && (
              <BridgeTokenButton
                inputToken={bridgingTokenWithHighestBalance.currencyInfo}
                outputToken={nativeCurrencyInfo}
                outputNetworkName={networkName}
                onPress={onClose}
              />
            )}

            {!isTestnetModeEnabled && (
              <BuyNativeTokenButton
                nativeCurrencyInfo={nativeCurrencyInfo}
                usesStaticText={!!bridgingTokenWithHighestBalance}
                usesStaticTheme={!!bridgingTokenWithHighestBalance}
                onPress={onClose}
              />
            )}
          </Flex>
        </WarningModal>
      )}
    </>
  )
}
