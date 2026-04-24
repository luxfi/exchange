import type { SlippageControlProps } from '@l.x/lx/src/features/transactions/components/settings/settingsConfigurations/slippage/SlippageControl/types'
import { PlatformSplitStubError } from '@l.x/utils/src/errors'

/**
 * Base implementation of the slippage setting control.
 * For the swap-specific implementation, see SwapFormSettings.
 */
export function SlippageControl(_props: SlippageControlProps): JSX.Element {
  throw new PlatformSplitStubError('SlippageControl')
}
