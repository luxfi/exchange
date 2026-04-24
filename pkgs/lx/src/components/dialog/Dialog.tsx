import type { DialogProps } from '@l.x/lx/src/components/dialog/DialogProps'
import { PlatformSplitStubError } from '@l.x/utils/src/errors'

/**
 * A dialog component that renders platform-specific implementations.
 * Web/extension: Modal dialog
 * Native: To be implemented
 */
export function Dialog(_: DialogProps): JSX.Element {
  throw new PlatformSplitStubError('Dialog')
}
