import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
<<<<<<< HEAD
import { Anchor, Flex, styled, Text } from '@l.x/ui/src'
import { ArrowUpRight } from '@l.x/ui/src/components/icons/ArrowUpRight'
import { BookOpen } from '@l.x/ui/src/components/icons/BookOpen'
import { GraduationCap } from '@l.x/ui/src/components/icons/GraduationCap'
import { PenLine } from '@l.x/ui/src/components/icons/PenLine'
import { SpeechBubbles } from '@l.x/ui/src/components/icons/SpeechBubbles'
import { lxUrls } from '@l.x/lx/src/constants/urls'
import { ClickableGuiStyle } from '~/theme/components/styles'
=======
import { Anchor, Flex, styled, Text } from 'ui/src'
import { ArrowUpRight } from 'ui/src/components/icons/ArrowUpRight'
import { BookOpen } from 'ui/src/components/icons/BookOpen'
import { GraduationCap } from 'ui/src/components/icons/GraduationCap'
import { PenLine } from 'ui/src/components/icons/PenLine'
import { SpeechBubbles } from 'ui/src/components/icons/SpeechBubbles'
import { uniswapUrls } from 'uniswap/src/constants/urls'
import { ClickableTamaguiStyle } from '~/theme/components/styles'
>>>>>>> upstream/main

const SectionLayout = styled(Flex, {
  width: '100%',
  maxWidth: 1360,
  alignItems: 'center',
  gap: 40,
  p: 40,

  $lg: {
    p: 48,
  },

  $sm: {
    p: 24,
  },
})

const RowContent = React.memo(function RowContent({
  icon,
  title,
  description,
  showArrow,
}: {
  icon: React.ReactNode
  title: string
  description: string | React.ReactNode
  showArrow: boolean
}) {
  return (
    <Flex
      row
      py="$gap32"
      borderTopWidth={1}
      borderTopColor="$surface3"
      alignItems="center"
      width="100%"
      $lg={{ alignItems: 'flex-start' }}
    >
      <Flex row gap="$gap24" alignItems="center" flex={1} $lg={{ alignItems: 'flex-start', gap: '$gap16' }}>
        <Flex flexShrink={0}>{icon}</Flex>
        <Flex
          flex={1}
          gap="$gap16"
          alignItems="center"
          $platform-web={{ display: 'grid', gridTemplateColumns: '220px 1fr' }}
          $xl={{ '$platform-web': { gridTemplateColumns: '180px 1fr' } }}
          $lg={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
        >
          <Text variant="heading2" $md={{ variant: 'heading3', lineHeight: 36 }}>
            {title}
          </Text>
          {/* Apply left margin to match the description with the position of the icon */}
          <Text variant="heading3" $lg={{ ml: -48 }} $md={{ fontSize: 18, lineHeight: 24 }}>
            {description}
          </Text>
        </Flex>
      </Flex>
      {showArrow && (
        <Flex flexShrink={0}>
          <ArrowUpRight size="$icon.36" color="$neutral1" />
        </Flex>
      )}
    </Flex>
  )
})

RowContent.displayName = 'RowContent'

function UniverseRow({
  icon,
  title,
  description,
  href,
}: {
  icon: React.ReactNode
  title: string
  description: string | React.ReactNode
  href?: string
}) {
  const showArrow = Boolean(href)

  if (href) {
    return (
      <Anchor
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        textDecorationLine="none"
<<<<<<< HEAD
        {...ClickableGuiStyle}
=======
        {...ClickableTamaguiStyle}
>>>>>>> upstream/main
      >
        <RowContent icon={icon} title={title} description={description} showArrow={showArrow} />
      </Anchor>
    )
  }

  return <RowContent icon={icon} title={title} description={description} showArrow={showArrow} />
}

const SocialLink = styled(Anchor, {
  fontSize: 'inherit',
  lineHeight: 'inherit',
  fontWeight: 'inherit',
  color: '$neutral2',
  target: '_blank',
  rel: 'noopener noreferrer',
<<<<<<< HEAD
  ...ClickableGuiStyle,
=======
  ...ClickableTamaguiStyle,
>>>>>>> upstream/main
  style: {
    textDecoration: 'none',
  },
})

export function NewsletterEtc() {
  const { t } = useTranslation()

  return (
    <SectionLayout>
      <Text variant="heading1" width="100%" $md={{ variant: 'heading2' }}>
        {t('landing.exploreUniverse')}
      </Text>
      <Flex width="100%">
        <UniverseRow
          icon={<GraduationCap size="$icon.36" fill="$neutral1" />}
          title={t('common.helpCenter')}
          description={t('landing.helpCenter.body')}
<<<<<<< HEAD
          href={lxUrls.helpCenterUrl}
=======
          href={uniswapUrls.helpCenterUrl}
>>>>>>> upstream/main
        />
        <UniverseRow
          icon={
            <Flex p="$gap4">
              <PenLine size="$icon.28" color="$neutral1" />
            </Flex>
          }
          title={t('common.blog')}
          description={t('landing.blog.description')}
<<<<<<< HEAD
          href={lxUrls.blogUrl}
=======
          href={uniswapUrls.blogUrl}
>>>>>>> upstream/main
        />
        <UniverseRow
          icon={<BookOpen size="$icon.36" fill="$neutral1" />}
          title={t('common.docs')}
          description={t('landing.docs.description')}
<<<<<<< HEAD
          href={lxUrls.docsUrl}
=======
          href={uniswapUrls.docsUrl}
>>>>>>> upstream/main
        />
        <UniverseRow
          icon={<SpeechBubbles size="$icon.36" color="$neutral1" />}
          title={t('common.socials')}
          description={
            <Trans
              i18nKey="landing.socials"
              components={{
<<<<<<< HEAD
                LinkX: <SocialLink href={lxUrls.social.x} />,
                LinkFarcaster: <SocialLink href={lxUrls.social.farcaster} />,
                LinkLinkedIn: <SocialLink href={lxUrls.social.linkedin} />,
                LinkTikTok: <SocialLink href={lxUrls.social.tiktok} />,
=======
                LinkX: <SocialLink href={uniswapUrls.social.x} />,
                LinkFarcaster: <SocialLink href={uniswapUrls.social.farcaster} />,
                LinkLinkedIn: <SocialLink href={uniswapUrls.social.linkedin} />,
                LinkTikTok: <SocialLink href={uniswapUrls.social.tiktok} />,
>>>>>>> upstream/main
              }}
            />
          }
        />
      </Flex>
    </SectionLayout>
  )
}
