import type { GetProps } from 'tamagui'
declare const InputFrame: import('tamagui').TamaguiComponent<
  import('@tamagui/core').TamaDefer,
  import('tamagui').TamaguiElement,
  import('@tamagui/core').RNTamaguiViewNonStyleProps,
  import('@tamagui/core').StackStyleBase,
  {
    error?: boolean | undefined
    size?: 'md' | 'sm' | 'lg' | undefined
    elevation?: number | import('tamagui').SizeTokens | undefined
    inset?:
      | number
      | import('tamagui').SizeTokens
      | {
          top?: number
          bottom?: number
          left?: number
          right?: number
        }
      | null
      | undefined
    fullscreen?: boolean | undefined
  },
  import('@tamagui/core').StaticConfigPublic
>
export type InputProps = Omit<GetProps<typeof InputFrame>, 'onChange'> & {
  value?: string
  onChangeText?: (text: string) => void
  placeholder?: string
  type?: 'text' | 'number' | 'password'
  leftElement?: React.ReactNode
  rightElement?: React.ReactNode
}
export declare const Input: import('react').ForwardRefExoticComponent<
  Omit<
    import('@tamagui/core').GetFinalProps<
      import('@tamagui/core').RNTamaguiViewNonStyleProps,
      import('@tamagui/core').StackStyleBase,
      {
        error?: boolean | undefined
        size?: 'md' | 'sm' | 'lg' | undefined
        elevation?: number | import('tamagui').SizeTokens | undefined
        inset?:
          | number
          | import('tamagui').SizeTokens
          | {
              top?: number
              bottom?: number
              left?: number
              right?: number
            }
          | null
          | undefined
        fullscreen?: boolean | undefined
      }
    >,
    'onChange'
  > & {
    value?: string
    onChangeText?: (text: string) => void
    placeholder?: string
    type?: 'text' | 'number' | 'password'
    leftElement?: React.ReactNode
    rightElement?: React.ReactNode
  } & import('react').RefAttributes<HTMLInputElement>
>
//# sourceMappingURL=Input.d.ts.map
