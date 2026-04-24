import { SkeletonProps } from '@l.x/ui/src/loading/SkeletonProps'
import { PlatformSplitStubError } from '@l.x/utils/src/errors'

export function Skeleton(_props: SkeletonProps): JSX.Element {
  throw new PlatformSplitStubError('Skeleton')
}
