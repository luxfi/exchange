import { useStyle } from '@hanzo/gui'
import { CustomButtonText } from '@luxfi/ui/src/components/buttons/Button/components/CustomButtonText/CustomButtonText'
import type { TypeOfButton } from '@luxfi/ui/src/components/buttons/Button/components/types'
import { useIconSizes } from '@luxfi/ui/src/components/buttons/Button/hooks/useIconSizes'
import type { ButtonVariantProps } from '@luxfi/ui/src/components/buttons/Button/types'
import { SpinningLoader } from '@luxfi/ui/src/loading/SpinningLoader'

type ThemedSpinningLoaderProps = Pick<ButtonVariantProps, 'size' | 'variant' | 'emphasis' | 'isDisabled'> & {
  typeOfButton: TypeOfButton
}

export const ThemedSpinningLoader = ({
  size = 'medium',
  variant,
  emphasis,
  isDisabled,
  typeOfButton,
}: ThemedSpinningLoaderProps): JSX.Element => {
  const iconSizes = useIconSizes(typeOfButton)
  // @ts-expect-error we know the color will be there; deficiency in gui's types
  // TODO: possibly look into this as a performance bottleneck (refer to typedef for more info)
  const { color } = useStyle({ variant, emphasis, isDisabled }, { forComponent: CustomButtonText })

  const loaderSize = iconSizes[size]

  return <SpinningLoader unstyled color={color} size={loaderSize} />
}
