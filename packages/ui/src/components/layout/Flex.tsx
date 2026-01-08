import type React from 'react'
import type { Insets } from 'react-native'
import { type GetProps, type SizeTokens, type SpaceTokens, styled, type TamaguiElement, View } from 'tamagui'
import { animationsEnter, animationsEnterExit, animationsExit } from 'ui/src/animations/presets'

export const flexStyles = {
  fill: { flex: 1 },
  grow: { flexGrow: 1 },
  shrink: { flexShrink: 1 },
}

// Shorthand props type for padding and margin
export type ShorthandSpaceProps = {
  /** Padding all sides */
  p?: SpaceTokens | number
  /** Padding horizontal (left + right) */
  px?: SpaceTokens | number
  /** Padding vertical (top + bottom) */
  py?: SpaceTokens | number
  /** Padding top */
  pt?: SpaceTokens | number
  /** Padding bottom */
  pb?: SpaceTokens | number
  /** Padding left */
  pl?: SpaceTokens | number
  /** Padding right */
  pr?: SpaceTokens | number
  /** Margin all sides */
  m?: SpaceTokens | number
  /** Margin horizontal (left + right) */
  mx?: SpaceTokens | number
  /** Margin vertical (top + bottom) */
  my?: SpaceTokens | number
  /** Margin top */
  mt?: SpaceTokens | number
  /** Margin bottom */
  mb?: SpaceTokens | number
  /** Margin left */
  ml?: SpaceTokens | number
  /** Margin right */
  mr?: SpaceTokens | number
}

type SizeOrNumber = number | SizeTokens

type SizedInset = {
  top: SizeOrNumber
  left: SizeOrNumber
  right: SizeOrNumber
  bottom: SizeOrNumber
}

const getInset = (val: SizeOrNumber): SizedInset => ({
  top: val,
  right: val,
  bottom: val,
  left: val,
})

const FlexFrame = styled(View, {
  name: 'Flex',
  flexDirection: 'column',

  variants: {
    inset: (size: SizeOrNumber | Insets) => (size && typeof size === 'object' ? size : getInset(size)),

    row: {
      true: {
        flexDirection: 'row',
      },
      false: {
        flexDirection: 'column',
      },
    },

    shrink: {
      true: {
        flexShrink: 1,
      },
    },

    grow: {
      true: {
        flexGrow: 1,
      },
    },

    fill: {
      true: {
        flex: 1,
      },
    },

    centered: {
      true: {
        alignItems: 'center',
        justifyContent: 'center',
      },
    },

    animateEnter: animationsEnter,
    animateExit: animationsExit,
    animateEnterExit: animationsEnterExit,
  } as const,
})

type FlexFrameProps = GetProps<typeof FlexFrame>

// Extend FlexProps with shorthand types that Tamagui supports at runtime
export type FlexProps = FlexFrameProps & ShorthandSpaceProps

/**
 * Flex component with shorthand spacing props (p, px, py, m, mt, mb, etc.)
 * These shorthands work at runtime through Tamagui but need explicit typing.
 *
 * The type assertion is necessary because Tamagui supports shorthands at runtime
 * but the TypeScript types from styled() don't include them.
 */
export const Flex = FlexFrame as React.ForwardRefExoticComponent<FlexProps & React.RefAttributes<TamaguiElement>>
