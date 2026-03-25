/**
 * Re-exports Gui's Input component with proper typing
 */
import { type ComponentRef } from 'react'
import { Input as GuiInput, type InputProps as GuiInputProps } from '@hanzo/gui'

export const Input = GuiInput
export type InputProps = GuiInputProps
export type InputRef = ComponentRef<typeof GuiInput>
