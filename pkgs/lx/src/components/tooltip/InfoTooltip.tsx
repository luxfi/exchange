import { PropsWithChildren } from 'react'
import { InfoTooltipProps } from '@l.x/lx/src/components/tooltip/InfoTooltipProps'
import { PlatformSplitStubError } from '@l.x/utils/src/errors'

export function InfoTooltip(_props: PropsWithChildren<InfoTooltipProps>): JSX.Element {
  throw new PlatformSplitStubError('InfoTooltip')
}
