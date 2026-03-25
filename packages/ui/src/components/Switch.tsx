import type { GetProps } from '@hanzo/gui'
import { Switch as TSwitch } from '@hanzo/gui'

export type SwitchProps = GetProps<typeof TSwitch> & {
  switchSize?: 'sm' | 'md' | 'lg'
}

export function Switch({ switchSize = 'md', ...props }: SwitchProps) {
  const sizeMap = {
    sm: '$spacing16' as const,
    md: '$spacing20' as const,
    lg: '$spacing24' as const,
  }

  return (
    <TSwitch size={sizeMap[switchSize]} {...props}>
      <TSwitch.Thumb animation="quick" />
    </TSwitch>
  )
}
