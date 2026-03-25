import type { PropsWithChildren } from 'react'
import type { GetProps } from '@hanzo/gui'
import type { LinearGradientProps } from 'gui/linear-gradient'
import { Text } from 'ui/src/components/text'

export type GradientTextProps = PropsWithChildren<GetProps<typeof Text> & { gradient: LinearGradientProps }>

// TODO(WEB-4313): Implement GradientText for web
export function GradientText({ children, ...props }: GradientTextProps): JSX.Element {
  return <Text {...props}>{children}</Text>
}
