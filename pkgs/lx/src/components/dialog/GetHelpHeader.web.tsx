import { Link } from 'react-router'
import { GetHelpButtonUI } from '@l.x/lx/src/components/dialog/GetHelpButtonUI'
import type { GetHelpHeaderProps } from '@l.x/lx/src/components/dialog/GetHelpHeader'
import { type GetHelpButtonProps, GetHelpHeaderContent } from '@l.x/lx/src/components/dialog/GetHelpHeaderContent'
import { lxUrls } from '@l.x/lx/src/constants/urls'

function WebGetHelpButton({ url }: GetHelpButtonProps): JSX.Element {
  return (
    <Link to={url ?? lxUrls.helpUrl} style={{ textDecoration: 'none' }} target="_blank">
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
