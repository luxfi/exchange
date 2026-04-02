import type { ReactNode } from 'react'
import { Text } from '@luxfi/ui/src'

interface BidDescriptionProps {
  description: ReactNode
}

export function BidDescription({ description }: BidDescriptionProps): JSX.Element {
  return (
    <Text variant="body4" color="$neutral2">
      {description}
    </Text>
  )
}
