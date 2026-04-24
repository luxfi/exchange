import { useTranslation } from 'react-i18next'
import type { TextProps, TouchableAreaProps, TouchableTextLinkProps } from '@l.x/ui/src'
import { Button, TouchableTextLink } from '@l.x/ui/src'
import { openUri } from '@l.x/lx/src/utils/linking'
import { isWebPlatform } from '@l.x/utils/src/platform'
import { useEvent } from '@l.x/utils/src/react/hooks'

const onPressLearnMore = (uri: string): Promise<void> => openUri({ uri })

export const LearnMoreLink = ({
  url,
  textVariant = 'buttonLabel2',
  textColor = '$accent1',
  centered = false,
  display,
  onlyUseText = false,
  componentType = 'TouchableArea',
}: {
  url: string
  textVariant?: TextProps['variant']
  textColor?: TextProps['color']
  centered?: boolean
  display?: TouchableAreaProps['display']
  onlyUseText?: boolean
  componentType?: 'Button' | 'TouchableArea'
}): JSX.Element => {
  const { t } = useTranslation()

  const handleOnPress = useEvent(() => onPressLearnMore(url))

  if (componentType === 'Button') {
    return (
      <Button display={display} size={isWebPlatform ? 'medium' : 'large'} emphasis="text-only" onPress={handleOnPress}>
        <Button.Text color={textColor}>{t('common.button.learn')}</Button.Text>
      </Button>
    )
  }

  return (
    <TouchableTextLink
      onlyUseText={onlyUseText}
      color={textColor as TouchableTextLinkProps['color']}
      link={url}
      textAlign={centered ? 'center' : undefined}
      variant={textVariant as TouchableTextLinkProps['variant']}
      display={display}
    >
      {t('common.button.learn')}
    </TouchableTextLink>
  )
}
