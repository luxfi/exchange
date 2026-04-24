import { ReactNode } from 'react'
import { FlexProps } from '@l.x/ui/src'
import { NotImplementedError } from '@l.x/utils/src/errors'

export type GetHelpHeaderProps = {
  closeModal: () => void
  link?: string
  title?: ReactNode
  goBack?: () => void
  closeDataTestId?: string
  className?: string
} & FlexProps

export function GetHelpHeader(_props: GetHelpHeaderProps): JSX.Element {
  throw new NotImplementedError('GetHelpHeader is implemented for web and native')
}
