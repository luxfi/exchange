import { PropsWithChildren } from 'react'
import { GetProps } from '@hanzo/gui'
import { LinearGradientProps } from '@hanzo/gui/linear-gradient'
import { Text } from '@luxfi/ui/src/components/text'

export type GradientTextProps = PropsWithChildren<GetProps<typeof Text> & { gradient: LinearGradientProps }>

// TODO(WEB-4313): Implement GradientText for web
export function GradientText({ children, ...props }: GradientTextProps): JSX.Element {
  return <Text {...props}>{children}</Text>
}
