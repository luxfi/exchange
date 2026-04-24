import { Flex, Text } from '@l.x/ui/src'
import { Gas } from '@l.x/ui/src/components/icons/Gas'
import { LXFee } from '@l.x/lx/src/components/gas/NetworkFee'
import { NetworkFeeWarning } from '@l.x/lx/src/components/gas/NetworkFeeWarning'
import type { GasInfo } from '@l.x/lx/src/features/transactions/swap/form/SwapFormScreen/SwapFormScreenDetails/SwapFormScreenFooter/GasAndWarningRows/types'
import { TestID } from '@l.x/lx/src/test/fixtures/testIDs'
import { isZero } from '@l.x/lx/src/utils/number'
import { isWebApp } from '@l.x/utils/src/platform'

function NetworkFeeWarningContent({ gasInfo }: { gasInfo?: GasInfo }): JSX.Element | null {
  if (!gasInfo?.fiatPriceFormatted) {
    return null
  }

  const color = gasInfo.isHighRelativeToValue && !isWebApp ? '$statusCritical' : '$neutral2' // Avoid high gas UI on interface
  const lxOrderSavings = gasInfo.lxOrderGasFeeInfo?.preSavingsGasFeeFormatted
  const isGasFeeFree = gasInfo.gasFee.value !== undefined && isZero(gasInfo.gasFee.value)

  return dexSavings ? (
    <DEXFee gasFee={gasInfo.fiatPriceFormatted} isFree={isGasFeeFree} preSavingsGasFee={dexSavings} />
  ) : (
    <>
      <Gas color={color} size="$icon.16" />
      <Text color={color} variant="body3">
        {gasInfo.fiatPriceFormatted}
      </Text>
    </>
  )
}

export function GasInfoRow({ gasInfo, hidden }: { gasInfo: GasInfo; hidden?: boolean }): JSX.Element | null {
  if (!gasInfo.fiatPriceFormatted) {
    return null
  }

  return (
    <Flex centered row animation="quick" enterStyle={{ opacity: 0 }} opacity={hidden ? 0 : gasInfo.isLoading ? 0.6 : 1}>
      <NetworkFeeWarning
        gasFeeHighRelativeToValue={gasInfo.isHighRelativeToValue}
        placement={isWebApp ? 'top' : 'bottom'}
        tooltipTrigger={
          <Flex centered row gap="$spacing4" testID={TestID.GasInfoRow}>
            <NetworkFeeWarningContent gasInfo={hidden ? undefined : gasInfo} />
          </Flex>
        }
        disabled={hidden}
        dexGasFeeInfo={gasInfo.dexGasFeeInfo}
        chainId={gasInfo.chainId}
      />
    </Flex>
  )
}
