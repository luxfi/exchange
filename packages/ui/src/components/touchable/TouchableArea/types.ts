import type { GestureResponderEvent } from 'react-native'
import type { GetProps, SpaceTokens } from 'tamagui'
import type { TouchableAreaFrame } from 'ui/src/components/touchable/TouchableArea/TouchableAreaFrame'

// Shorthand props type for padding and margin
type ShorthandSpaceProps = {
  p?: SpaceTokens | number
  px?: SpaceTokens | number
  py?: SpaceTokens | number
  pt?: SpaceTokens | number
  pb?: SpaceTokens | number
  pl?: SpaceTokens | number
  pr?: SpaceTokens | number
  m?: SpaceTokens | number
  mx?: SpaceTokens | number
  my?: SpaceTokens | number
  mt?: SpaceTokens | number
  mb?: SpaceTokens | number
  ml?: SpaceTokens | number
  mr?: SpaceTokens | number
}

type TouchableAreaFrameProps = GetProps<typeof TouchableAreaFrame>

type Variant = TouchableAreaFrameProps['variant']

type TouchableAreaExtraProps = {
  /**
   * If true, the touchable area will resize itself to fit minimum dimensions defined by accessibility guidelines
   *
   * Defaults to false for backwards compatibility with previous versions of the TouchableArea component
   */
  shouldConsiderMinimumDimensions?: boolean
  scaleTo?: number
  ignoreDragEvents?: boolean
  activeOpacity?: number
  /**
   * If true, calls event.stopPropagation() on press events to prevent bubbling to parent touchables.
   * Works on both web and React Native (where supported).
   */
  shouldStopPropagation?: boolean
  /**
   * If true, the `TouchableArea` will automatically inject colors into its children per Spore Design System guidelines. See Storybook for examples.
   *
   * Defaults to true for Web, false for React Native.
   */
  shouldAutomaticallyInjectColors?: boolean
}

// All variants except 'raised'
type NonRaisedProps = TouchableAreaExtraProps &
  Omit<TouchableAreaFrameProps, 'variant' | 'backgroundColor'> & {
    variant?: Exclude<Variant, 'raised'>
    backgroundColor?: TouchableAreaFrameProps['backgroundColor']
  }

// 'raised' variant requires backgroundColor
type RaisedProps = TouchableAreaExtraProps &
  Omit<TouchableAreaFrameProps, 'variant' | 'backgroundColor'> & {
    variant: Extract<Variant, 'raised'>
    backgroundColor: NonNullable<TouchableAreaFrameProps['backgroundColor']>
  }

export type TouchableAreaProps = (NonRaisedProps | RaisedProps) & ShorthandSpaceProps
export type TouchableAreaEvent = GestureResponderEvent
