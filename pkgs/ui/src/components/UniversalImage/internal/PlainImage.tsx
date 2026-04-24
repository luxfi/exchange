import { PlainImageProps } from '@l.x/ui/src/components/UniversalImage/types'
import { PlatformSplitStubError } from '@l.x/utils/src/errors'

export function PlainImage(_props: PlainImageProps): JSX.Element {
  throw new PlatformSplitStubError('PlainImage')
}
