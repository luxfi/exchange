import { useDispatch } from 'react-redux'
import { Flex, IconProps, Text, TouchableArea } from 'ui/src'
import { LuxLogo } from 'ui/src/components/icons'
import { resetLuxBehaviorHistory } from 'lx/src/features/behaviorHistory/slice'
import { resetWalletBehaviorHistory } from 'wallet/src/features/behaviorHistory/slice'

export function ResetBehaviorHistoryRow({ iconProps }: { iconProps: IconProps }): JSX.Element {
  const dispatch = useDispatch()

  const onPressReset = (): void => {
    dispatch(resetWalletBehaviorHistory())
    dispatch(resetLuxBehaviorHistory())
  }

  return (
    <TouchableArea onPress={onPressReset}>
      <Flex row alignItems="center" justifyContent="space-between" py="$spacing4">
        <Flex row alignItems="center">
          <Flex centered height={32} width={32}>
            <LuxLogo {...iconProps} />
          </Flex>
          <Text ml="$spacing12" variant="body1">
            Reset behavior history
          </Text>
        </Flex>
      </Flex>
    </TouchableArea>
  )
}
