import { PropsWithChildren } from 'react'
import { Flex, Shine } from '@l.x/ui/src'

export function IndicativeLoadingWrapper({ children, loading }: PropsWithChildren<{ loading?: boolean }>): JSX.Element {
  if (loading) {
    return (
      <Shine>
        <Flex backgroundColor="$surface3" borderRadius={8} height={20} width={60} />
      </Shine>
    )
  }

  return <>{children}</>
}
