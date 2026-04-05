import { memo } from 'react'
<<<<<<< HEAD
import { RelativeChange } from '@l.x/lx/src/components/RelativeChange/RelativeChange'
=======
import { RelativeChange } from 'uniswap/src/components/RelativeChange/RelativeChange'
>>>>>>> upstream/main
import { EmptyTableCell } from '~/pages/Portfolio/EmptyTableCell'

export const RelativeChange1D = memo(function RelativeChange1D({ value }: { value: number | undefined }): JSX.Element {
  if (!value && value !== 0) {
    return <EmptyTableCell />
  }

  return (
    <RelativeChange
      change={value}
      arrowSize="$icon.16"
      negativeChangeColor="$statusCritical"
      positiveChangeColor="$statusSuccess"
      color="$neutral1"
      variant="body3"
      alignRight
    />
  )
})
RelativeChange1D.displayName = 'RelativeChange1D'
