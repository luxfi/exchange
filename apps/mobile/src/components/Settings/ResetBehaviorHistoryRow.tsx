import { useDispatch } from 'react-redux'
<<<<<<< HEAD
import { Flex, IconProps, Text, TouchableArea } from '@l.x/ui/src'
import { LuxLogo } from '@l.x/ui/src/components/icons'
import { resetLuxBehaviorHistory } from '@l.x/lx/src/features/behaviorHistory/slice'
import { resetWalletBehaviorHistory } from '@luxfi/wallet/src/features/behaviorHistory/slice'
=======
import { Flex, IconProps, Text, TouchableArea } from 'ui/src'
import { UniswapLogo } from 'ui/src/components/icons'
import { resetUniswapBehaviorHistory } from 'uniswap/src/features/behaviorHistory/slice'
import { resetWalletBehaviorHistory } from 'wallet/src/features/behaviorHistory/slice'
>>>>>>> upstream/main

export function ResetBehaviorHistoryRow({ iconProps }: { iconProps: IconProps }): JSX.Element {
  const dispatch = useDispatch()

  const onPressReset = (): void => {
    dispatch(resetWalletBehaviorHistory())
<<<<<<< HEAD
    dispatch(resetLuxBehaviorHistory())
=======
    dispatch(resetUniswapBehaviorHistory())
>>>>>>> upstream/main
  }

  return (
    <TouchableArea onPress={onPressReset}>
      <Flex row alignItems="center" justifyContent="space-between" py="$spacing4">
        <Flex row alignItems="center">
          <Flex centered height={32} width={32}>
<<<<<<< HEAD
            <LuxLogo {...iconProps} />
=======
            <UniswapLogo {...iconProps} />
>>>>>>> upstream/main
          </Flex>
          <Text ml="$spacing12" variant="body1">
            Reset behavior history
          </Text>
        </Flex>
      </Flex>
    </TouchableArea>
  )
}
