import { TextStyle } from '@luxfi/ui/src'
import { css } from '~/lib/deprecated-styled'

/** @deprecated use gui and EllipsisGuiStyle instead */
export const EllipsisStyle = css`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const EllipsisGuiStyle = {
  '$platform-web': {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
} satisfies TextStyle
