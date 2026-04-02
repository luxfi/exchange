import { Flex, Image } from '@luxfi/ui/src'
import { OPENSEA_LOGO } from '@luxfi/ui/src/assets'
import { DEP_accentColors, imageSizes, validColor } from '@luxfi/ui/src/theme'

export const OpenseaElement = (): JSX.Element => {
  return (
    <Flex backgroundColor={validColor(DEP_accentColors.blue400)} borderRadius="$roundedFull" p="$spacing4">
      <Image
        height={imageSizes.image32}
        $xs={{ height: imageSizes.image24, width: imageSizes.image24 }}
        resizeMode="contain"
        source={OPENSEA_LOGO}
        width={imageSizes.image32}
      />
    </Flex>
  )
}
