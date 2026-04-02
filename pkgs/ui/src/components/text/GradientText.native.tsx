import MaskedView from '@react-native-masked-view/masked-view'
import { LinearGradient } from '@hanzo/gui/linear-gradient'
import { Text } from '@luxfi/ui/src/components/text'
import { GradientTextProps } from '@luxfi/ui/src/components/text/GradientText'

export function GradientText({ gradient, children, ...props }: GradientTextProps): JSX.Element {
  return (
    <MaskedView maskElement={<Text {...props}>{children}</Text>}>
      <LinearGradient {...gradient}>
        <Text {...props} opacity={0}>
          {children}
        </Text>
      </LinearGradient>
    </MaskedView>
  )
}
