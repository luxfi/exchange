import { IconSizeTokens } from '@l.x/ui/src/theme'
import { DisplayName } from '@l.x/lx/src/features/accounts/types'
import { PlatformSplitStubError } from '@l.x/utils/src/errors'

export type AnimatedUnitagDisplayNameProps = {
  displayName: DisplayName
  unitagIconSize?: IconSizeTokens
  address?: string
}

/**
 * Renders as a bottom sheet modal on mobile app/mweb & a dialog modal on desktop web/extension.
 */
export function AnimatedUnitagDisplayName(_: AnimatedUnitagDisplayNameProps): JSX.Element {
  throw new PlatformSplitStubError('AnimatedUnitagDisplayName')
}
