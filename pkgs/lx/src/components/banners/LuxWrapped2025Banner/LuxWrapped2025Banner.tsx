import { Flex } from '@l.x/ui/src/components/layout'
import { LuxWrapped2025Card } from '../LuxWrapped2025Card/LuxWrapped2025Card'

interface LXWrapped2025BannerProps {
  handleDismiss: () => void
  handlePress: () => void
}

export function LXWrapped2025Banner({ handleDismiss, handlePress }: LXWrapped2025BannerProps): JSX.Element {
  return (
    <Flex width="100%">
      <LuxWrapped2025Card onPress={handlePress} onDismiss={handleDismiss} />
    </Flex>
  )
}
