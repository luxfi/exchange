import { Flex, Image } from '@l.x/ui/src'
import { FROGGY } from '@l.x/ui/src/assets'
import { imageSizes } from '@l.x/ui/src/theme'

export const FroggyElement = (): JSX.Element => {
  return (
    <Flex borderRadius="$rounded12" p="$spacing8" transform={[{ rotateZ: '-10deg' }]}>
      <Image
        height={imageSizes.image48}
        $xs={{ height: imageSizes.image36, width: imageSizes.image36 }}
        resizeMode="contain"
        source={FROGGY}
        width={imageSizes.image48}
      />
    </Flex>
  )
}
