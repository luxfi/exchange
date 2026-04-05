import type { ReactNode } from 'react'
<<<<<<< HEAD
import { Text } from '@l.x/ui/src'
=======
import { Text } from 'ui/src'
>>>>>>> upstream/main

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
