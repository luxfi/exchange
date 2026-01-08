import type React from 'react'
import type { UniconProps } from 'ui/src/components/Unicon/types'
import { PlatformSplitStubError } from 'utilities/src/errors'

export const Unicon: React.FC<UniconProps> = () => {
  throw new PlatformSplitStubError('Unicon')
}
