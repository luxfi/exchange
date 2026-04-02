import type { FlexProps } from '@luxfi/ui/src/components/layout'

export type ShineProps = {
  shimmerDurationSeconds?: number
  disabled?: boolean
  children: JSX.Element
} & Omit<FlexProps, 'children'>
