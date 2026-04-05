import { Fragment, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
<<<<<<< HEAD
import { Anchor, AnchorProps, Flex, Text, TouchableArea } from '@l.x/ui/src'
import { spacing } from '@l.x/ui/src/theme'
import { lxUrls } from '@l.x/lx/src/constants/urls'
import { ModalName } from '@l.x/lx/src/features/telemetry/constants'
import { isMobileWeb } from '@l.x/utils/src/platform'
import { useBooleanState } from '@l.x/utils/src/react/useBooleanState'
=======
import { Anchor, AnchorProps, Flex, Text, TouchableArea } from 'ui/src'
import { spacing } from 'ui/src/theme'
import { uniswapUrls } from 'uniswap/src/constants/urls'
import { ModalName } from 'uniswap/src/features/telemetry/constants'
import { isMobileWeb } from 'utilities/src/platform'
import { useBooleanState } from 'utilities/src/react/useBooleanState'
>>>>>>> upstream/main
import Expand from '~/components/Expand'
import { PrivacyOptions } from '~/components/Icons/PrivacyOptions'
import { useModalState } from '~/hooks/useModalState'

const MobileTouchableArea = isMobileWeb ? TouchableArea : Fragment

const MenuLink = ({ children, ...rest }: AnchorProps) => (
  <Anchor textDecorationLine="none" cursor="pointer" group {...rest}>
    <MobileTouchableArea>
      <Text
        color="$neutral2"
        $group-hover={{ color: '$accent1' }}
        transition="all 0.1s ease-in-out"
        variant="body4"
        display="flex"
        alignItems="center"
        gap="$gap4"
      >
        {children}
      </Text>
    </MobileTouchableArea>
  </Anchor>
)

export function LegalAndPrivacyMenu({ closeMenu }: { closeMenu?: () => void }) {
  const { toggle: toggleIsOpen, value: isOpen } = useBooleanState(false)
  const { t } = useTranslation()
  const { toggleModal: togglePrivacyPolicy } = useModalState(ModalName.PrivacyPolicy)
  const { openModal: openPrivacyChoices } = useModalState(ModalName.PrivacyChoices)
  const handleOnMenuPress = useCallback(
    (handler: () => void) => () => {
      handler()
      closeMenu?.()
    },
    [closeMenu],
  )

  return (
    <Expand
      isOpen={isOpen}
      onToggle={toggleIsOpen}
      iconSize="$icon.16"
      button={
        <Text color="$neutral2" variant="body4" pr={spacing.spacing4}>
          {t('common.legalAndPrivacy')}
        </Text>
      }
      paddingTop="8px"
      width="100%"
    >
      <Flex gap="$gap8">
        <MenuLink onPress={handleOnMenuPress(openPrivacyChoices)}>
          <PrivacyOptions /> {t('common.privacyChoices')}
        </MenuLink>
        <MenuLink onPress={handleOnMenuPress(togglePrivacyPolicy)}>{t('common.privacyPolicy')}</MenuLink>
<<<<<<< HEAD
        <MenuLink href={lxUrls.termsOfServiceUrl} target="_blank">
=======
        <MenuLink href={uniswapUrls.termsOfServiceUrl} target="_blank">
>>>>>>> upstream/main
          {t('common.termsOfService')}
        </MenuLink>
      </Flex>
    </Expand>
  )
}
