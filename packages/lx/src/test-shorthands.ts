// Test shorthand types
import type { Shorthands, StackProps } from 'tamagui'
import { Flex, type FlexProps } from 'ui/src'

// Test: Check if Shorthands has the correct keys
type ShorthandsKeys = keyof Shorthands

// If this compiles without error, shorthands are in Shorthands type
const testPx: ShorthandsKeys = 'px'
const testP: ShorthandsKeys = 'p'

// Check if FlexProps has px
type TestFlexPx = FlexProps extends { px?: any } ? 'has-px' : 'no-px'
const flexTest: TestFlexPx = 'has-px' // This line will error if FlexProps doesn't have px
