import { TouchableArea } from '@l.x/ui/src'
import { BackArrow } from '@l.x/ui/src/components/icons'
import { zIndexes } from '@l.x/ui/src/theme'

export function ModalBackButton({ onBack }: { onBack: () => void }): JSX.Element {
  return (
    <TouchableArea
      hoverable
      borderRadius="$roundedFull"
      p="$spacing4"
      position="absolute"
      zIndex={zIndexes.default}
      onPress={onBack}
    >
      <BackArrow color="$neutral2" size="$icon.24" />
    </TouchableArea>
  )
}
