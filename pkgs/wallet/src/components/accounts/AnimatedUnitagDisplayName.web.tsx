import { SharedEventName } from '@luxamm/analytics-events'
import { BaseSyntheticEvent, useState } from 'react'
import { LayoutChangeEvent } from 'react-native'
import { useDispatch } from 'react-redux'
import { AnimatePresence, Flex, Text, TouchableArea } from '@l.x/ui/src'
import { CopyAlt, Unitag } from '@l.x/ui/src/components/icons'
import { DisplayNameType } from '@l.x/lx/src/features/accounts/types'
import { pushNotification } from '@l.x/lx/src/features/notifications/slice/slice'
import { AppNotificationType, CopyNotificationType } from '@l.x/lx/src/features/notifications/slice/types'
import { ElementName } from '@l.x/lx/src/features/telemetry/constants'
import { sendAnalyticsEvent } from '@l.x/lx/src/features/telemetry/send'
import { UNITAG_SUFFIX } from '@l.x/lx/src/features/unitags/constants'
import { TestID } from '@l.x/lx/src/test/fixtures/testIDs'
import { ExtensionScreens } from '@l.x/lx/src/types/screens/extension'
import { MobileScreens } from '@l.x/lx/src/types/screens/mobile'
import { sanitizeAddressText } from '@l.x/lx/src/utils/addresses'
import { shortenAddress } from '@l.x/utils/src/addresses'
import { setClipboard } from '@l.x/utils/src/clipboard/clipboard'
import { isExtensionApp, isMobileApp } from '@l.x/utils/src/platform'
import { AnimatedUnitagDisplayNameProps } from '@luxfi/wallet/src/components/accounts/AnimatedUnitagDisplayName'

export function AnimatedUnitagDisplayName({
  displayName,
  unitagIconSize = '$icon.24',
  address,
}: AnimatedUnitagDisplayNameProps): JSX.Element {
  const dispatch = useDispatch()
  const [showUnitagSuffix, setShowUnitagSuffix] = useState(false)
  const [textWidth, setTextWidth] = useState(0)
  const isUnitag = displayName.type === DisplayNameType.Unitag

  const onTextLayout = (event: LayoutChangeEvent): void => {
    setTextWidth(event.nativeEvent.layout.width)
  }

  const onPressUnitag = (): void => {
    setShowUnitagSuffix(!showUnitagSuffix)
  }

  const onPressCopyAddress = async (e: BaseSyntheticEvent): Promise<void> => {
    if (!address) {
      return
    }

    e.stopPropagation()
    await setClipboard(address)
    dispatch(
      pushNotification({
        type: AppNotificationType.Copied,
        copyType: CopyNotificationType.Address,
      }),
    )
    sendAnalyticsEvent(SharedEventName.ELEMENT_CLICKED, {
      element: ElementName.CopyAddress,
      screen: isExtensionApp ? ExtensionScreens.Home : isMobileApp ? MobileScreens.Home : undefined,
    })
  }

  const isLayoutReady = textWidth > 0

  return (
    <Flex shrink cursor="pointer" onPress={isUnitag ? onPressUnitag : undefined}>
      <AnimatePresence>
        <Flex row>
          <Text color="$neutral1" numberOfLines={1} variant="subheading1">
            {displayName.name}
          </Text>

          <Flex row animation="semiBouncy" ml={-textWidth} x={showUnitagSuffix ? textWidth : 0}>
            {/*
          We need to calculate this width in order to animate the suffix in and out,
          but we don't want the initial render to show the suffix nor use the space and push other elements to the right.
          So we set it to `position: absolute` on first render and then switch it to `relative` once we have the width.
          */}
            <Flex position={isLayoutReady ? 'relative' : 'absolute'} onLayout={onTextLayout}>
              <Text animation="semiBouncy" color="$neutral3" opacity={showUnitagSuffix ? 1 : 0} variant="subheading1">
                {UNITAG_SUFFIX}
              </Text>
            </Flex>

            {isUnitag ? (
              <Flex animation="semiBouncy" pl="$spacing4">
                <Unitag size={unitagIconSize} />
              </Flex>
            ) : null}
          </Flex>
        </Flex>

        {address && (
          <TouchableArea hitSlop={20} testID={TestID.AccountHeaderCopyAddress} onPress={onPressCopyAddress}>
            <Flex row alignItems="center" gap="$spacing4">
              <Text color="$neutral3" numberOfLines={1} variant="body2">
                {sanitizeAddressText(shortenAddress({ address }))}
              </Text>
              <CopyAlt color="$neutral3" size="$icon.16" />
            </Flex>
          </TouchableArea>
        )}
      </AnimatePresence>
    </Flex>
  )
}
