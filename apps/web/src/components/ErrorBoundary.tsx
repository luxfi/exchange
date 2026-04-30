import { Component, type PropsWithChildren, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Flex, Switch, Text, TouchableArea } from '@l.x/ui/src'
import { CopyAlt } from '@l.x/ui/src/components/icons/CopyAlt'
import { RotatableChevron } from '@l.x/ui/src/components/icons/RotatableChevron'
import { lxUrls } from '@l.x/lx/src/constants/urls'
import { logger } from '@l.x/utils/src/logger/logger'
import { useIsMobile } from '~/hooks/screenSize/useIsMobile'
import { deprecatedStyled } from '~/lib/deprecated-styled'
import { persistor } from '~/state'
import { useAppStateResetter } from '~/state/reset/appResetter'
import { ThemedText } from '~/theme/components'
import { CopyToClipboard } from '~/theme/components/CopyHelper'
import { ExternalLink } from '~/theme/components/Links'

const Code = deprecatedStyled.code`
  font-weight: 485;
  font-size: 12px;
  line-height: 16px;
  word-wrap: break-word;
  width: 100%;
  color: ${({ theme }) => theme.neutral1};
  font-family: ${({ theme }) => theme.fonts.code};
  overflow: scroll;
  max-height: calc(100vh - 450px);
  -webkit-overflow-scrolling: touch;
`

const Separator = deprecatedStyled.div`
  border-bottom: 1px solid ${({ theme }) => theme.surface3};
`

const Fallback = ({ error, eventId }: { error: Error; eventId: string | null }) => {
  const { t } = useTranslation()
  const isMobile = useIsMobile()
  const appStateResetter = useAppStateResetter()

  const errorDetails = error.stack || error.message

  const [isClearDataEnabled, setIsClearDataEnabled] = useState(false)
  const [isReloading, setIsReloading] = useState(false)
  const handleReload = useCallback(async () => {
    setIsReloading(true)
    if (isClearDataEnabled) {
      try {
        await appStateResetter.resetAll()
        // Flush persistor to ensure state is written to storage before reload
        await persistor.flush()
      } catch (e) {
        logger.error(e, {
          tags: {
            file: 'ErrorBoundary',
            function: 'handleReload',
          },
        })
      }
    }
    window.location.reload()
  }, [isClearDataEnabled, appStateResetter])

  return (
    <Flex
      height="100%"
      width="100%"
      position="absolute"
      centered
      top={0}
      left={0}
      right={0}
      bottom={0}
      backgroundColor="$surface1"
    >
      <Flex
        gap="$gap16"
        width="100%"
        p={isMobile ? '$spacing16' : '$spacing1'}
        maxWidth={isMobile ? '100%' : 500}
        centered
      >
        <ErrorDetailsSection errorDetails={errorDetails} eventId={eventId} />
        <Flex
          alignSelf="stretch"
          backgroundColor="$surface2"
          borderRadius="$rounded16"
          gap="$spacing8"
          p={isMobile ? '$spacing12' : '$spacing16'}
        >
          <Flex row alignItems="center" justifyContent="space-between">
            <Text variant="subheading2">{t('errors.crash.resetData.title')}</Text>
            <Switch checked={isClearDataEnabled} variant="default" onCheckedChange={setIsClearDataEnabled} />
          </Flex>
          <Text color="$neutral2" variant="body3">
            {t('errors.crash.resetData.description.web')}
          </Text>
        </Flex>
        <Flex width="100%" row gap="$gap12">
          <ExternalLink
            style={{ flexGrow: 1, flexBasis: 0 }}
            id="get-support-on-discord"
            href={lxUrls.helpRequestUrl}
            target="_blank"
          >
            <Flex row>
              <Button emphasis="secondary" size="small">
                {t('common.getSupport.button')}
              </Button>
            </Flex>
          </ExternalLink>
          <Flex row flexBasis={0} flexGrow={1}>
            <Button
              emphasis="primary"
              size="small"
              loading={isReloading}
              isDisabled={isReloading}
              onPress={handleReload}
            >
              {t('common.reload.label')}
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}

function ErrorDetailsSection({ errorDetails, eventId }: { errorDetails: string; eventId: string | null }): JSX.Element {
  const { t } = useTranslation()
  const [isExpanded, setExpanded] = useState(false)
  const isMobile = useIsMobile()

  // @todo: ThemedText components should be responsive by default
  const [Title, Description] = isMobile
    ? [ThemedText.HeadlineSmall, ThemedText.BodySmall]
    : [ThemedText.HeadlineLarge, ThemedText.BodySecondary]

  return (
    <>
      <Flex gap="$gap8" mb="$spacing8">
        <Title textAlign="center">{t('common.card.error.description')}</Title>
        <Description textAlign="center" color="neutral2">
          {eventId ? t('error.request.provideId') : t('common.error.request')}
        </Description>
      </Flex>
      <Flex
        alignSelf="stretch"
        backgroundColor="$surface2"
        gap="$spacing8"
        p={isMobile ? '$spacing12' : '$spacing16'}
        borderRadius="$rounded24"
      >
        <Flex row gap="$gap16" alignItems="center" justifyContent="space-between">
          <ThemedText.SubHeader>
            {eventId ? t('error.id', { eventId }) : t('common.error.details')}
          </ThemedText.SubHeader>
          <CopyToClipboard toCopy={eventId ?? errorDetails}>
            <CopyAlt color="$neutral2" size="$icon.24" />
          </CopyToClipboard>
        </Flex>
        <Separator />
        <Flex my="spacing12" gap="$spacing8">
          <Code>{errorDetails.split('\n').slice(0, isExpanded ? undefined : 4)}</Code>
          <Separator />
        </Flex>
        <TouchableArea flexDirection="row" justifyContent="space-between" onPress={() => setExpanded((s) => !s)}>
          <ThemedText.Link color="neutral2">
            {isExpanded ? t('common.showLess.button') : t('common.showMore.button')}
          </ThemedText.Link>
          <RotatableChevron size="$icon.20" direction={isExpanded ? 'up' : 'down'} />
        </TouchableArea>
      </Flex>
    </>
  )
}

type FallbackComponent = React.ComponentType<{ error: Error; resetError: () => void }>

interface ErrorBoundaryProps extends PropsWithChildren {
  fallback?: FallbackComponent
}

interface ErrorBoundaryState {
  error: Error | null
}

/**
 * Plain React error boundary. Used to wrap Datadog's `ErrorBoundary` from
 * `@datadog/browser-rum-react`; the SDK was removed and we now use a stock
 * `componentDidCatch` boundary. Errors are surfaced to the active logger
 * via `logger.error`, which routes through whatever observability driver
 * is active (no-op by default).
 */
class ErrorBoundaryImpl extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public override state: ErrorBoundaryState = { error: null }

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  public override componentDidCatch(error: Error, info: React.ErrorInfo): void {
    logger.error(error, {
      tags: { file: 'ErrorBoundary', function: 'componentDidCatch' },
      extra: { componentStack: info.componentStack ?? null },
    })
  }

  public resetError = (): void => {
    this.setState({ error: null })
  }

  public override render(): React.ReactNode {
    const { error } = this.state
    if (error) {
      const FallbackComp = this.props.fallback
      if (FallbackComp) {
        return <FallbackComp error={error} resetError={this.resetError} />
      }
      return <Fallback error={error} eventId={null} />
    }
    return this.props.children
  }
}

export default function ErrorBoundary(props: ErrorBoundaryProps): JSX.Element {
  return <ErrorBoundaryImpl {...props} />
}
