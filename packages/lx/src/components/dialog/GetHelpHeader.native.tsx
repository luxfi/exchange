import { TouchableArea } from 'ui/src'
import { GetHelpButtonUI } from 'lx/src/components/dialog/GetHelpButtonUI'
import type { GetHelpHeaderProps } from 'lx/src/components/dialog/GetHelpHeader'
import { type GetHelpButtonProps, GetHelpHeaderContent } from 'lx/src/components/dialog/GetHelpHeaderContent'
import { uniswapUrls } from 'lx/src/constants/urls'
import { openUri } from 'lx/src/utils/linking'

function NativeGetHelpButton({ url }: GetHelpButtonProps): JSX.Element {
  const handlePress = async (): Promise<void> => {
    await openUri({ uri: url ?? uniswapUrls.helpUrl })
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
