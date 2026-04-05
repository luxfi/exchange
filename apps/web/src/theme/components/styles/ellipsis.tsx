<<<<<<< HEAD
import { TextStyle } from '@l.x/ui/src'
import { css } from '~/lib/deprecated-styled'

/** @deprecated use gui and EllipsisGuiStyle instead */
=======
import { TextStyle } from 'ui/src'
import { css } from '~/lib/deprecated-styled'

/** @deprecated use tamagui and EllipsisTamaguiStyle instead */
>>>>>>> upstream/main
export const EllipsisStyle = css`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

<<<<<<< HEAD
export const EllipsisGuiStyle = {
=======
export const EllipsisTamaguiStyle = {
>>>>>>> upstream/main
  '$platform-web': {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
} satisfies TextStyle
