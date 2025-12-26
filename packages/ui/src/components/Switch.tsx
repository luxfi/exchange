import { Switch as TSwitch } from 'tamagui'
import type { GetProps } from 'tamagui'

export type SwitchProps = GetProps<typeof TSwitch> & {
  size?: 'sm' | 'md' | 'lg'
}

export function Switch({ size = 'md', ...props }: SwitchProps) {
  const sizeMap = {
    sm: '$2',
    md: '$3',
    lg: '$4',
  } as const

  return (
    <TSwitch size={sizeMap[size]} {...props}>
      <TSwitch.Thumb animation="quick" />
    </TSwitch>
  )
}
