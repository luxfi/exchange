import { memo } from 'react'
import { DecimalPadProps } from '@l.x/lx/src/features/transactions/components/DecimalPadInput/types'
import { NotImplementedError } from '@l.x/utils/src/errors'

export const DecimalPad = memo(function DecimalPad(_props: DecimalPadProps): JSX.Element {
  throw new NotImplementedError('DecimalPad')
})
