import { PlatformSplitStubError } from '@l.x/utils/src/errors'

export interface RefreshButtonProps {
  onPress: () => void
  isLoading: boolean
}

// TODO(CONS-698): Replace other refresh icons with this component
export function RefreshButton(_props: RefreshButtonProps): JSX.Element {
  throw new PlatformSplitStubError('RefreshButton')
}
