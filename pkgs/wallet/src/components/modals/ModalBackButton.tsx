import { TouchableArea } from '@luxfi/ui/src'
import { BackArrow } from '@luxfi/ui/src/components/icons'
import { zIndexes } from '@luxfi/ui/src/theme'

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
