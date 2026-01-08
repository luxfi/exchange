/**
 * Re-exports Tamagui's Input component with proper typing
 */
import { type ComponentRef } from 'react'
import { Input as TamaguiInput, type InputProps as TamaguiInputProps } from 'tamagui'

export const Input = TamaguiInput
export type InputProps = TamaguiInputProps
export type InputRef = ComponentRef<typeof TamaguiInput>
