import { useTranslation } from 'react-i18next'
<<<<<<< HEAD
import { AnimatableCopyIcon, Flex, FlexProps } from '@l.x/ui/src'
import { ElementName } from '@l.x/lx/src/features/telemetry/constants'
import Trace from '@l.x/lx/src/features/telemetry/Trace'
import { TestID } from '@l.x/lx/src/test/fixtures/testIDs'
import { useEvent } from '@l.x/utils/src/react/hooks'
import { useBooleanState } from '@l.x/utils/src/react/useBooleanState'
import { ONE_SECOND_MS } from '@l.x/utils/src/time/time'
=======
import { AnimatableCopyIcon, Flex, FlexProps } from 'ui/src'
import { ElementName } from 'uniswap/src/features/telemetry/constants'
import Trace from 'uniswap/src/features/telemetry/Trace'
import { TestID } from 'uniswap/src/test/fixtures/testIDs'
import { useEvent } from 'utilities/src/react/hooks'
import { useBooleanState } from 'utilities/src/react/useBooleanState'
import { ONE_SECOND_MS } from 'utilities/src/time/time'
>>>>>>> upstream/main
import { ActionTile } from '~/components/AccountDrawer/ActionTile'
import { Wiggle } from '~/components/animations/Wiggle'
import useCopyClipboard from '~/hooks/useCopyClipboard'

interface CopyAddressActionTileProps {
  address: string
  padding?: FlexProps['p']
}

export function CopyAddressActionTile({ address, padding = '$spacing12' }: CopyAddressActionTileProps): JSX.Element {
  const { t } = useTranslation()
  const [isCopied, copyToClipboard] = useCopyClipboard(ONE_SECOND_MS)
  const { value: isHovered, setTrue: setIsHovered, setFalse: setIsHoveredFalse } = useBooleanState(false)

  const onPressCopy = useEvent(() => {
    copyToClipboard(address)
  })

  return (
    <Trace logPress element={ElementName.PortfolioActionCopyAddress}>
      <Flex onHoverIn={setIsHovered} onHoverOut={setIsHoveredFalse}>
        <ActionTile
          dataTestId={TestID.PortfolioActionTileCopyAddress}
          Icon={
            <Wiggle
              isAnimating={isHovered && !isCopied}
              width="max-content"
              display="flex"
              alignItems="center"
              justifyContent="center"
              wiggleAmount={10}
            >
              <AnimatableCopyIcon isCopied={isCopied} size={24} textColor="$accent1" />
            </Wiggle>
          }
          name={t('common.copy.address')}
          onClick={onPressCopy}
          padding={padding}
        />
      </Flex>
    </Trace>
  )
}
