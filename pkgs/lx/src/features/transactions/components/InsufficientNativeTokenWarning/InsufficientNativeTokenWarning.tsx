import { Currency } from '@luxamm/sdk-core'
import { GasFeeResult } from '@l.x/api'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Flex, Text, TouchableArea } from '@l.x/ui/src'
import { CurrencyLogo } from '@l.x/lx/src/components/CurrencyLogo/CurrencyLogo'
import { Warning } from '@l.x/lx/src/components/modals/WarningModal/types'
import { WarningModal } from '@l.x/lx/src/components/modals/WarningModal/WarningModal'
import { LearnMoreLink } from '@l.x/lx/src/components/text/LearnMoreLink'
import { lxUrls } from '@l.x/lx/src/constants/urls'
import { useActiveAddresses } from '@l.x/lx/src/features/accounts/store/hooks'
import type { AddressGroup } from '@l.x/lx/src/features/accounts/store/types/AccountsState'
import { useBridgingTokenWithHighestBalance } from '@l.x/lx/src/features/bridging/hooks/tokens'
import { useEnabledChains } from '@l.x/lx/src/features/chains/hooks/useEnabledChains'
import { UniverseChainId } from '@l.x/lx/src/features/chains/types'
import { CurrencyInfo } from '@l.x/lx/src/features/dataApi/types'
import { ModalName } from '@l.x/lx/src/features/telemetry/constants'
import { BridgeTokenButton } from '@l.x/lx/src/features/transactions/components/InsufficientNativeTokenWarning/BridgeTokenButton'
import { BuyNativeTokenButton } from '@l.x/lx/src/features/transactions/components/InsufficientNativeTokenWarning/BuyNativeTokenButton'
import { InsufficientNativeTokenBaseComponent } from '@l.x/lx/src/features/transactions/components/InsufficientNativeTokenWarning/InsufficientNativeTokenBaseComponent'
import { useInsufficientNativeTokenWarning } from '@l.x/lx/src/features/transactions/components/InsufficientNativeTokenWarning/useInsufficientNativeTokenWarning'
import { currencyIdToAddress } from '@l.x/lx/src/utils/currencyId'
import { logger } from '@l.x/utils/src/logger/logger'
import { isExtensionApp, isWebPlatform } from '@l.x/utils/src/platform'

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
              url={lxUrls.helpArticleUrls.networkFeeInfo}
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
