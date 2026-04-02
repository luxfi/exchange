import { useTranslation } from 'react-i18next'
import { Anchor, Flex, Text, TouchableArea } from '@luxfi/ui/src'
import { BookOpen } from '@luxfi/ui/src/components/icons/BookOpen'
import { ExternalLink } from '@luxfi/ui/src/components/icons/ExternalLink'
import { GraduationCap } from '@luxfi/ui/src/components/icons/GraduationCap'
import { SpeechBubbles } from '@luxfi/ui/src/components/icons/SpeechBubbles'
import { X } from '@luxfi/ui/src/components/icons/X'
import { lxUrls } from '@luxexchange/lx/src/constants/urls'
import { TestID } from '@luxexchange/lx/src/test/fixtures/testIDs'

interface HelpContentProps {
  onClose?: () => void
}

function HelpItem({ icon, title, href }: { icon: React.ReactNode; title: string; href: string }) {
  return (
    <Anchor href={href} target="_blank" textDecorationLine="none" width="min-content">
      <Flex row gap="$gap4" alignItems="center">
        {icon}
        <Text variant="body3" whiteSpace="nowrap">
          {title}
        </Text>
        <ExternalLink size="$icon.12" color="$neutral2" />
      </Flex>
    </Anchor>
  )
}

export function HelpContent({ onClose }: HelpContentProps) {
  const { t } = useTranslation()

  return (
    <Flex
      py="$padding12"
      pr="$padding8"
      pl="$padding12"
      gap="$gap12"
      width={240}
      zIndex="$tooltip"
      borderRadius="$rounded12"
      borderWidth="$spacing1"
      borderColor="$surface3"
      backgroundColor="$surface2"
      userSelect="none"
      boxShadow="$shadow.1"
      data-testid={TestID.HelpModal}
    >
      <Flex row justifyContent="space-between" alignItems="center">
        <Text variant="body4" color="$neutral2">
          {t('common.help')}
        </Text>
        <TouchableArea onPress={onClose}>
          <X size="$icon.20" color="$neutral2" />
        </TouchableArea>
      </Flex>
      <HelpItem
        icon={<GraduationCap size="$icon.20" color="$neutral2" />}
        title={t('settings.action.help')}
        href={lxUrls.helpUrl}
      />
      <HelpItem
        icon={<BookOpen size="$icon.20" color="$neutral2" />}
        title={t('common.docs')}
        href={lxUrls.docsUrl}
      />
      <HelpItem
        icon={<SpeechBubbles size="$icon.20" color="$neutral2" />}
        title={t('common.contactUs.button')}
        href={lxUrls.helpRequestUrl}
      />
    </Flex>
  )
}
