import { forwardRef } from 'react'
import { Input as GuiInput, InputProps as GuiInputProps } from '@luxfi/ui/src'
import { inputStyles } from '@luxfi/ui/src/components/input/utils'
import { fonts } from '@luxfi/ui/src/theme/fonts'

export type InputProps = {
  large?: boolean
  hideInput?: boolean
  centered?: boolean
} & GuiInputProps

export type Input = GuiInput

export const Input = forwardRef<Input, InputProps>(function _Input(
  { large = false, hideInput = false, centered = false, ...rest }: InputProps,
  ref,
): JSX.Element {
  return (
    <GuiInput
      ref={ref}
      backgroundColor={large ? '$surface1' : '$surface2'}
      borderColor="$surface3"
      borderRadius="$rounded16"
      borderWidth="$spacing1"
      focusStyle={inputStyles.inputFocus}
      fontSize={fonts.subheading2.fontSize}
      height="auto"
      hoverStyle={inputStyles.inputHover}
      placeholderTextColor="$neutral3"
      px={centered ? '$spacing60' : '$spacing24'}
      py={large ? '$spacing20' : '$spacing16'}
      secureTextEntry={hideInput}
      textAlign={centered ? 'center' : 'left'}
      width="100%"
      {...rest}
    />
  )
})
