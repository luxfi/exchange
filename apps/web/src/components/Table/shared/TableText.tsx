import { PropsWithChildren } from 'react'
import { Text, TextProps } from '@luxfi/ui/src'
import { breakpoints } from '@luxfi/ui/src/theme'
import { useTableSize } from '~/components/Table/TableSizeProvider'

export const TableText = ({ children, ...props }: PropsWithChildren<TextProps>) => {
  const { width: tableWidth } = useTableSize()

  // Avoid rendering text until we have the table width to prevent layout flickering
  if (!tableWidth) {
    return <></>
  }

  return (
    <Text color="$neutral1" variant={tableWidth <= breakpoints.lg ? 'body3' : 'body2'} {...props}>
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
