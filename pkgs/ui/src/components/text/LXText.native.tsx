import { GetProps } from '@hanzo/gui'
import { Text } from '@l.x/ui/src/components/text'
import { GradientText } from '@l.x/ui/src/components/text/GradientText'
import { colors } from '@l.x/ui/src/theme/color/colors'

export function LXText({ children, ...props }: GetProps<typeof Text>): JSX.Element {
  return (
    <GradientText
      {...props}
      gradient={{
        colors: [colors.lxOrderViolet, colors.lxOrderPurple],
        start: { x: -1.07, y: 0 },
        end: { x: 1.07, y: 0 },
      }}
    >
      {children}
    </GradientText>
  )
}
