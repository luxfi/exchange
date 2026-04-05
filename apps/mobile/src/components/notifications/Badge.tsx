import React, { memo, PropsWithChildren } from 'react'
<<<<<<< HEAD
import { Flex } from '@l.x/ui/src'
import { useSelectAddressHasNotifications } from '@l.x/lx/src/features/notifications/slice/hooks'
=======
import { Flex } from 'ui/src'
import { useSelectAddressHasNotifications } from 'uniswap/src/features/notifications/slice/hooks'
>>>>>>> upstream/main

type Props = PropsWithChildren<{
  address: Address
}>

const NOTIFICATION_DOT_SIZE = 12

<<<<<<< HEAD
function _NotificationBadge({ children, address }: Props): JSX.Element {
=======
function NotificationBadgeInner({ children, address }: Props): JSX.Element {
>>>>>>> upstream/main
  const hasNotifications = useSelectAddressHasNotifications(address)
  return (
    <Flex position="relative">
      {hasNotifications ? (
        <Flex
          backgroundColor="$accent1"
          borderColor="$surface2"
          borderRadius="$roundedFull"
          borderWidth="$spacing2"
          height={NOTIFICATION_DOT_SIZE}
          position="absolute"
          right={-NOTIFICATION_DOT_SIZE / 4}
          top={NOTIFICATION_DOT_SIZE / 8}
          width={NOTIFICATION_DOT_SIZE}
          zIndex="$popover"
        />
      ) : null}
      {children}
    </Flex>
  )
}

<<<<<<< HEAD
export const NotificationBadge = memo(_NotificationBadge)
=======
export const NotificationBadge = memo(NotificationBadgeInner)
>>>>>>> upstream/main
