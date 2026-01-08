import { getOverrides, StatsigContext } from '@luxfi/gating'
import { RowBetween } from 'components/deprecated/Row'
import { MouseoverTooltip, TooltipSize } from 'components/Tooltip'
import { useModalState } from 'hooks/useModalState'
import { useContext, useState } from 'react'
import { Flag, Settings } from 'react-feather'
import { useDispatch } from 'react-redux'
import { ThemedText } from 'theme/components'
import { ClickableTamaguiStyle } from 'theme/components/styles'
import { Button, Flex, TouchableArea, useShadowPropsShort } from 'ui/src'
import { resetUniswapBehaviorHistory } from 'lx/src/features/behaviorHistory/slice'
import { ModalName } from 'lx/src/features/telemetry/constants'
import { TestID } from 'lx/src/test/fixtures/testIDs'
import { isBetaEnv, isDevEnv } from 'utilities/src/environment/env'

const Override = (name: string, value: any) => {
  return (
    <ThemedText.LabelSmall key={name}>
      {name}: {JSON.stringify(value)}
    </ThemedText.LabelSmall>
  )
}

export default function DevFlagsBox() {
  const { client: statsigClient } = useContext(StatsigContext)
  const { gateOverrides, configOverrides } = getOverrides(statsigClient)
  const shadowProps = useShadowPropsShort()

  const overrides = [...gateOverrides, ...configOverrides].map(([name, value]) => Override(name, value))

  const hasOverrides = overrides.length > 0

  const [isOpen, setIsOpen] = useState(false)
  const { toggleModal: toggleFeatureFlagsModal } = useModalState(ModalName.FeatureFlags)

  const dispatch = useDispatch()

  const onPressReset = (): void => {
    dispatch(resetUniswapBehaviorHistory())
  }

  // When collapsed, show circular icon button matching HelpModal style
  if (!isOpen) {
    return (
      <Flex
        $platform-web={{
          position: 'fixed',
        }}
        bottom="$spacing20"
        right="$spacing20"
        zIndex="$modal"
      >
        <TouchableArea
          hoverable
          {...ClickableTamaguiStyle}
          onPress={() => setIsOpen(true)}
        >
          <Flex
            centered
            width={36}
            height={36}
            borderRadius="$roundedFull"
            backgroundColor="$surface1"
            testID={TestID.DevFlagsBox}
          >
            <Flag size={18} color="currentColor" />
          </Flex>
        </TouchableArea>
      </Flex>
    )
  }

  // Expanded state
  return (
    <Flex
      $platform-web={{
        position: 'fixed',
        ...shadowProps,
      }}
      bottom="$spacing20"
      right="$spacing20"
      zIndex="$modal"
      padding={10}
      borderWidth={1}
      borderColor="$surface3"
      borderRadius="$rounded8"
      cursor="pointer"
      backgroundColor="$surface1"
      hoverStyle={{
        backgroundColor: '$surface1Hovered',
      }}
      testID={TestID.DevFlagsBox}
      onPress={() => setIsOpen(false)}
    >
      <RowBetween>
        <ThemedText.SubHeader>
          {isDevEnv() && 'Local Overrides'}
          {isBetaEnv() && 'Staging Overrides'}
        </ThemedText.SubHeader>
        <MouseoverTooltip
          size={TooltipSize.Small}
          text="Protip: Set feature flags by adding '?featureFlagOverride={flag_name}' to the URL"
        >
          <Flex
            centered
            width={30}
            height={30}
            borderRadius="$rounded8"
            testID={TestID.DevFlagsSettingsToggle}
            hoverStyle={{
              backgroundColor: '$surface1Hovered',
            }}
            onPress={(e) => {
              e.stopPropagation()
              toggleFeatureFlagsModal()
            }}
          >
            <Settings width={15} height={15} />
          </Flex>
        </MouseoverTooltip>
      </RowBetween>

      {hasOverrides ? overrides : <ThemedText.LabelSmall>No overrides</ThemedText.LabelSmall>}
      <Button variant="branded" emphasis="secondary" size="small" onPress={onPressReset} mt="$spacing8">
        Reset behavior history
      </Button>
    </Flex>
  )
}
