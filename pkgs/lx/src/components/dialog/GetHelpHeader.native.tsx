import { TouchableArea } from '@l.x/ui/src'
import { GetHelpButtonUI } from '@l.x/lx/src/components/dialog/GetHelpButtonUI'
import type { GetHelpHeaderProps } from '@l.x/lx/src/components/dialog/GetHelpHeader'
import { type GetHelpButtonProps, GetHelpHeaderContent } from '@l.x/lx/src/components/dialog/GetHelpHeaderContent'
import { lxUrls } from '@l.x/lx/src/constants/urls'
import { openUri } from '@l.x/lx/src/utils/linking'

function NativeGetHelpButton({ url }: GetHelpButtonProps): JSX.Element {
  const handlePress = async (): Promise<void> => {
    await openUri({ uri: url ?? lxUrls.helpUrl })
  }

  return (
    <TouchableArea onPress={handlePress}>
      <GetHelpButtonUI />
    </TouchableArea>
  )
}

export function GetHelpHeader(props: GetHelpHeaderProps): JSX.Element {
  return <GetHelpHeaderContent {...props} GetHelpButton={NativeGetHelpButton} />
}
