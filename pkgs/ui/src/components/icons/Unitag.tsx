import { memo, useMemo } from 'react'
import { getTokenValue } from '@hanzo/gui'
import { UNITAG_DARK, UNITAG_DARK_SMALL, UNITAG_LIGHT, UNITAG_LIGHT_SMALL } from '@luxfi/ui/src/assets'
import { UniversalImageStyleProps } from '@luxfi/ui/src/components/UniversalImage/types'
import { UniversalImage } from '@luxfi/ui/src/components/UniversalImage/UniversalImage'
import { useIsDarkMode } from '@luxfi/ui/src/hooks/useIsDarkMode'
import { IconSizeTokens } from '@luxfi/ui/src/theme'
import { isMobileApp, isWebApp } from 'utilities/src/platform'

const style: UniversalImageStyleProps = {
  image: {
    verticalAlign: 'sub',
  },
}

function _Unitag({ size = '$icon.24' }: { size: IconSizeTokens | number }): JSX.Element {
  const isDarkMode = useIsDarkMode()

  const sizeNumber = typeof size === 'number' ? size : getTokenValue(size)
  const universalImageSize = useMemo(() => ({ height: sizeNumber, width: sizeNumber }), [sizeNumber])

  const uri = useMemo(() => {
    if (isDarkMode) {
      return isMobileApp ? UNITAG_DARK : UNITAG_DARK_SMALL
    }
    return isMobileApp ? UNITAG_LIGHT : UNITAG_LIGHT_SMALL
  }, [isDarkMode])

  if (isWebApp) {
    return <img src={uri} width={universalImageSize.width} height={universalImageSize.height} style={style.image} />
  } else {
    return <UniversalImage style={style} size={universalImageSize} uri={uri} allowLocalUri />
  }
}

export const Unitag = memo(_Unitag)
