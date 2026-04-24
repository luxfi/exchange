import { ProtocolVersion } from '@luxamm/client-data-api/dist/data/v1/poolTypes_pb'
import { memo } from 'react'
import { Flex, Text } from '@l.x/ui/src'
import { iconSizes } from '@l.x/ui/src/theme'
import Badge from '@l.x/lx/src/components/badge/Badge'
import { SplitLogo } from '@l.x/lx/src/components/CurrencyLogo/SplitLogo'
import { FocusedRowControl, OptionItem } from '@l.x/lx/src/components/lists/items/OptionItem'
import {
  PoolContextMenuAction,
  PoolOptionItemContextMenu,
} from '@l.x/lx/src/components/lists/items/pools/PoolOptionItemContextMenu'
import { BIPS_BASE } from '@l.x/lx/src/constants/misc'
import { UniverseChainId } from '@l.x/lx/src/features/chains/types'
import { CurrencyInfo } from '@l.x/lx/src/features/dataApi/types'
import { ellipseMiddle, shortenAddress } from '@l.x/utils/src/addresses'
import { useBooleanState } from '@l.x/utils/src/react/useBooleanState'

interface PoolOptionItemProps {
  token0CurrencyInfo: CurrencyInfo
  token1CurrencyInfo: CurrencyInfo
  poolId: string
  chainId: UniverseChainId
  onPress: () => void
  protocolVersion: ProtocolVersion
  hookAddress?: string
  feeTier: number
  focusedRowControl?: FocusedRowControl
  rightElement?: JSX.Element
}

function _PoolOptionItem({
  token0CurrencyInfo,
  token1CurrencyInfo,
  poolId,
  chainId,
  onPress,
  protocolVersion,
  hookAddress,
  feeTier,
  focusedRowControl,
  rightElement,
}: PoolOptionItemProps): JSX.Element {
  const poolName = `${token0CurrencyInfo.currency.symbol}/${token1CurrencyInfo.currency.symbol}`

  const optionItem = (
    <OptionItem
      image={
        <SplitLogo
          size={iconSizes.icon40}
          inputCurrencyInfo={token0CurrencyInfo}
          outputCurrencyInfo={token1CurrencyInfo}
          chainId={chainId}
        />
      }
      title={poolName}
      subtitle={
        <Text color="$neutral2" numberOfLines={1} variant="body3">
          {protocolVersion !== ProtocolVersion.V4
            ? shortenAddress({ address: poolId })
            : ellipseMiddle({ str: poolId, charsStart: 6 })}
        </Text>
      }
      badge={
        <Flex row gap="$spacing2" alignItems="center">
          <Badge size="small" placement="start">
            {ProtocolVersion[protocolVersion].toLowerCase()}
          </Badge>
          {hookAddress ? (
            <Badge size="small" placement="middle">
              {shortenAddress({ address: hookAddress, chars: 4 })}
            </Badge>
          ) : null}
          <Badge size="small" placement="end">
            {feeTier / BIPS_BASE}%
          </Badge>
        </Flex>
      }
      focusedRowControl={focusedRowControl}
      rightElement={rightElement}
      onPress={onPress}
    />
  )
  const { value: isContextMenuOpen, setFalse: closeContextMenu, setTrue: openContextMenu } = useBooleanState(false)

  return (
    <PoolOptionItemContextMenu
      actions={[PoolContextMenuAction.CopyAddress, PoolContextMenuAction.Share]}
      isOpen={isContextMenuOpen}
      closeMenu={closeContextMenu}
      openMenu={openContextMenu}
      poolId={poolId}
      chainId={chainId}
      protocolVersion={protocolVersion}
    >
      {optionItem}
    </PoolOptionItemContextMenu>
  )
}

export const PoolOptionItem = memo(_PoolOptionItem)
