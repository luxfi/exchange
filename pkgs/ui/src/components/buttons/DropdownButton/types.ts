import { GetProps } from '@hanzo/gui'
import { ButtonProps, ButtonVariantProps } from '@luxfi/ui/src/components/buttons/Button/types'
import { DropdownButtonFrame } from '@luxfi/ui/src/components/buttons/DropdownButton/DropdownButtonFrame'

export type DropdownButtonVariantProps = ButtonVariantProps & {
  isExpanded: boolean
}

export type DropdownButtonProps = Omit<
  ButtonProps,
  'size' | 'iconPosition' | 'buttonType' | 'variant' | 'justifyContent' | 'loading'
> & {
  size?: Extract<ButtonProps['size'], 'small' | 'medium' | 'large'>
  isExpanded: DropdownButtonVariantProps['isExpanded']
} & Pick<GetProps<typeof DropdownButtonFrame>, 'elementPositioning'>
