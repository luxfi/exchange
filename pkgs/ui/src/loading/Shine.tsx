import type { ShineProps } from '@l.x/ui/src/loading/ShineProps'
import { PlatformSplitStubError } from '@l.x/utils/src/errors'

export function Shine(_props: ShineProps): JSX.Element {
  throw new PlatformSplitStubError('Shine')
}
