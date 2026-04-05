import { FeatureFlags, useFeatureFlag } from '@universe/gating'
import { PropsWithChildren } from 'react'
import { Text, TextProps } from 'ui/src'
import { breakpoints } from 'ui/src/theme'
import { useTableSize } from '~/components/Table/TableSizeProvider'

export const TableText = ({ children, ...props }: PropsWithChildren<TextProps>) => {
  const { width: tableWidth } = useTableSize()
  const isMultichainTokenUx = useFeatureFlag(FeatureFlags.MultichainTokenUx)

  // Avoid rendering text until we have the table width to prevent layout flickering when multichainTokenUx flag is off
  if (!tableWidth && !isMultichainTokenUx) {
    return <></>
  }

  return (
    <Text
      color="$neutral1"
      variant={tableWidth <= breakpoints.lg && !isMultichainTokenUx ? 'body3' : 'body2'}
      {...props}
    >
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
