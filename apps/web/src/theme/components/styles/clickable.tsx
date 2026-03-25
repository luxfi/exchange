import { FlexProps } from 'ui/src'
import { css } from '~/lib/deprecated-styled'

/** @deprecated use gui and ClickableGuiStyle instead */
export const ClickableStyle = css`
  text-decoration: none;
  cursor: pointer;
  transition-duration: ${({ theme }) => theme.transition.duration.fast};

  :hover {
    opacity: ${({ theme }) => theme.opacity.hover};
  }
  :active {
    opacity: ${({ theme }) => theme.opacity.click};
  }
`
export const ClickableGuiStyle = {
  cursor: 'pointer',
  '$platform-web': {
    textDecoration: 'none',
    transitionDuration: '0.2s',
    textDecorationLine: 'none',
  },
  hoverStyle: {
    opacity: 0.8,
  },
  pressStyle: {
    opacity: 0.6,
  },
  // Gui bug. Animation property breaks theme value transition, must use style instead
  style: { transition: '100ms' },
} satisfies FlexProps
