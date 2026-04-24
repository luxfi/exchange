import { memo } from 'react'
import { DecimalPadProps } from '@l.x/lx/src/features/transactions/components/DecimalPadInput/types'
import { PlatformSplitStubError } from '@l.x/utils/src/errors'

export const DecimalPad = memo(function DecimalPad(_props: DecimalPadProps): JSX.Element {
  throw new PlatformSplitStubError('DecimalPad')
})
