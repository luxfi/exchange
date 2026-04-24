import { SwipeableCardStackProps } from '@l.x/ui/src/components/swipeablecards/props'
import { PlatformSplitStubError } from '@l.x/utils/src/errors'

export function SwipeableCardStack<T>(_props: SwipeableCardStackProps<T>): JSX.Element {
  throw new PlatformSplitStubError('SwipeableCardStack')
}
