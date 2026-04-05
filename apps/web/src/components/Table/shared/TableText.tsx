<<<<<<< HEAD
import { PropsWithChildren } from 'react'
import { Text, TextProps } from '@l.x/ui/src'
import { breakpoints } from '@l.x/ui/src/theme'
=======
import { FeatureFlags, useFeatureFlag } from '@universe/gating'
import { PropsWithChildren } from 'react'
import { Text, TextProps } from 'ui/src'
import { breakpoints } from 'ui/src/theme'
>>>>>>> upstream/main
import { useTableSize } from '~/components/Table/TableSizeProvider'

export const TableText = ({ children, ...props }: PropsWithChildren<TextProps>) => {
  const { width: tableWidth } = useTableSize()
<<<<<<< HEAD

  // Avoid rendering text until we have the table width to prevent layout flickering
  if (!tableWidth) {
=======
  const isMultichainTokenUx = useFeatureFlag(FeatureFlags.MultichainTokenUx)

  // Avoid rendering text until we have the table width to prevent layout flickering when multichainTokenUx flag is off
  if (!tableWidth && !isMultichainTokenUx) {
>>>>>>> upstream/main
    return <></>
  }

  return (
<<<<<<< HEAD
    <Text color="$neutral1" variant={tableWidth <= breakpoints.lg ? 'body3' : 'body2'} {...props}>
=======
    <Text
      color="$neutral1"
      variant={tableWidth <= breakpoints.lg && !isMultichainTokenUx ? 'body3' : 'body2'}
      {...props}
    >
>>>>>>> upstream/main
      {children}
    </Text>
  )
}

export const EllipsisText = ({ children, ...props }: PropsWithChildren<TextProps>) => {
  return (
    <TableText {...props} whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
      {children}
    </TableText>
  )
}
