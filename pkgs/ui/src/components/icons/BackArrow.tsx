import { I18nManager } from 'react-native'
import { GeneratedIconProps } from '@l.x/ui/src/components/factories/createIcon'
import { ArrowLeft, ArrowRight } from '@l.x/ui/src/components/icons'

export function BackArrow(props: GeneratedIconProps): JSX.Element {
  return I18nManager.isRTL ? <ArrowRight size="$icon.24" {...props} /> : <ArrowLeft size="$icon.24" {...props} />
}
