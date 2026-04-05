<<<<<<< HEAD
import { Flex } from '@l.x/ui/src'
import { Home, Search, SearchFilled, TimePast } from '@l.x/ui/src/components/icons'
import { iconSizes } from '@l.x/ui/src/theme'
import { useSelectAddressHasNotifications } from '@l.x/lx/src/features/notifications/slice/hooks'
import { useActiveAccountAddress } from '@luxfi/wallet/src/features/wallet/hooks'
=======
import { Flex } from 'ui/src'
import { Home, Search, SearchFilled, TimePast } from 'ui/src/components/icons'
import { iconSizes } from 'ui/src/theme'
import { useSelectAddressHasNotifications } from 'uniswap/src/features/notifications/slice/hooks'
import { useActiveAccountAddress } from 'wallet/src/features/wallet/hooks'
>>>>>>> upstream/main

export const TabHomeIcon = ({ color, size }: { color: string; focused: boolean; size: number }): JSX.Element => (
  <Home size={size} fill={color} color={color} />
)

export const TabExploreIcon = ({
  color,
  size,
  focused,
}: {
  color: string
  focused: boolean
  size: number
}): JSX.Element => {
  if (focused) {
    return <SearchFilled size={size} color={color} />
  }

  return <Search size={size} color={color} />
}

export const TabActivityIcon = ({ color, size }: { color: string; focused: boolean; size: number }): JSX.Element => {
  const activeAccountAddress = useActiveAccountAddress()
  const hasNotifications = useSelectAddressHasNotifications(activeAccountAddress)

  const icon = <TimePast size={size + 2} color={color} />

  if (hasNotifications) {
    return (
      <Flex position="relative">
        {icon}
        <Flex
          position="absolute"
          top={0}
          right={0}
          backgroundColor="$accent1"
          borderRadius="$roundedFull"
          height={iconSizes.icon8}
          width={iconSizes.icon8}
        />
      </Flex>
    )
  }

  return icon
}
