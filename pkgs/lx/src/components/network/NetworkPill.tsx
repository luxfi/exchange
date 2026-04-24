import { ComponentProps } from 'react'
import { iconSizes } from '@l.x/ui/src/theme'
import { NetworkLogo } from '@l.x/lx/src/components/CurrencyLogo/NetworkLogo'
import { Pill } from '@l.x/lx/src/components/pill/Pill'
import { UniverseChainId } from '@l.x/lx/src/features/chains/types'
import { getChainLabel } from '@l.x/lx/src/features/chains/utils'
import { useNetworkColors } from '@l.x/lx/src/utils/colors'

export type NetworkPillProps = {
  chainId: UniverseChainId
  showBackgroundColor?: boolean
  showBorder?: boolean
  showIcon?: boolean
  iconSize?: number
} & ComponentProps<typeof Pill>

export function NetworkPill({
  chainId,
  showBackgroundColor = true,
  showBorder,
  showIcon = false,
  iconSize = iconSizes.icon16,
  ...rest
}: NetworkPillProps): JSX.Element {
  const label = getChainLabel(chainId)
  const colors = useNetworkColors(chainId)

  return (
    <Pill
      customBackgroundColor={showBackgroundColor ? colors.background : undefined}
      customBorderColor={showBorder ? colors.foreground : 'transparent'}
      foregroundColor={colors.foreground}
      icon={showIcon ? <NetworkLogo chainId={chainId} size={iconSize} /> : null}
      label={label}
      {...rest}
    />
  )
}

export function InlineNetworkPill(props: NetworkPillProps): JSX.Element {
  return <NetworkPill borderRadius="$rounded8" px="$spacing4" py="$none" textVariant="buttonLabel3" {...props} />
}
