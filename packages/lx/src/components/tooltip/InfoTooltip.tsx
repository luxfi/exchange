import { PropsWithChildren } from 'react'
import { InfoTooltipProps } from 'lx/src/components/tooltip/InfoTooltipProps'
import { PlatformSplitStubError } from 'utilities/src/errors'

export function InfoTooltip(_props: PropsWithChildren<InfoTooltipProps>): JSX.Element {
  throw new PlatformSplitStubError('InfoTooltip')
}
