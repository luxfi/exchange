import Animated from 'react-native-reanimated'
import { Flex } from '@luxfi/ui/src/components/layout/Flex'

/**
 * @deprecated  Prefer `<Flex animation="" />`
 *
 *    See: https://gui.hanzo.ai/docs/core/animations
 *
 * TODO(MOB-1948): Remove this
 */
export const AnimatedFlex = Animated.createAnimatedComponent(Flex)
AnimatedFlex.displayName = 'AnimatedFlex'
