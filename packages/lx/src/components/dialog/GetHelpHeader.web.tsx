import { Link } from 'react-router'
import { GetHelpButtonUI } from 'lx/src/components/dialog/GetHelpButtonUI'
import type { GetHelpHeaderProps } from 'lx/src/components/dialog/GetHelpHeader'
import { type GetHelpButtonProps, GetHelpHeaderContent } from 'lx/src/components/dialog/GetHelpHeaderContent'
import { uniswapUrls } from 'lx/src/constants/urls'

function WebGetHelpButton({ url }: GetHelpButtonProps): JSX.Element {
  return (
    <Link to={url ?? uniswapUrls.helpUrl} style={{ textDecoration: 'none' }} target="_blank">
      <GetHelpButtonUI
        width="max-content"
        animation="fast"
        hoverStyle={{
          backgroundColor: '$surface3Hovered',
        }}
        $platform-web={{
          width: 'fit-content',
        }}
      />
    </Link>
  )
}

export function GetHelpHeader(props: GetHelpHeaderProps): JSX.Element {
  return <GetHelpHeaderContent {...props} GetHelpButton={WebGetHelpButton} backArrowHoverColor="$neutral2Hovered" />
}
