import { Component, lazy, memo, type ReactNode, Suspense, useRef } from 'react'
import { Flex, styled } from '@l.x/ui/src'
import { INTERFACE_NAV_HEIGHT } from '@l.x/ui/src/theme'
import { logger } from '@l.x/utils/src/logger/logger'
import { Hero } from '~/pages/Landing/sections/Hero'

// The Fold is always loaded, but is lazy-loaded because it is not seen without user interaction.
// Annotating it with webpackPreload allows it to be ready when requested.
// Static-import the section components so a single failing import surfaces a real error
// at module-eval time rather than producing a silently rejected dynamic-import promise
// that leaves <Suspense> in a permanently pending state and collapses the page to one
// viewport (the bug seen on zoo.exchange where scrollHeight ≈ 901px and Stats /
// AppsOverview / NewsletterEtc / Footer never mount).
const Fold = lazy(() => import(/* webpackPreload: true */ './Fold'))

const Rive = lazy(() => import(/* webpackPreload: true */ '~/setupRive'))

// FoldBoundary: catches errors thrown while resolving or rendering the lazy Fold
// chunk. Without this, a rejected dynamic-import propagates past <Suspense> and
// the entire below-the-fold UI silently disappears. Logging the real error lets
// us see *which* module failed in prod (Datadog / browser console).
class FoldBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  componentDidCatch(error: Error, info: { componentStack?: string }) {
    logger.error(error, {
      tags: { file: 'LandingV2', function: 'FoldBoundary' },
      extra: { componentStack: info.componentStack },
    })
  }
  render() {
    if (this.state.hasError) {
      return null
    }
    return this.props.children
  }
}

const Grain = styled(Flex, {
  position: 'absolute',
  inset: 0,
  background: 'url(/images/noise-color.png)',
  opacity: 0.018,
  zIndex: 0,
})

function LandingV2({ transition }: { transition?: boolean }) {
  const scrollAnchor = useRef<HTMLDivElement | null>(null)
  const scrollToRef = () => {
    if (scrollAnchor.current) {
      window.scrollTo({
        top: scrollAnchor.current.offsetTop - 120,
        behavior: 'smooth',
      })
    }
  }

  return (
    <Flex
      position="relative"
      alignItems="center"
      mt={-INTERFACE_NAV_HEIGHT}
      minWidth="100vw"
      data-testid="landing-page"
    >
      <Grain />
      <Hero scrollToRef={scrollToRef} transition={transition} />
      <FoldBoundary>
        {/* Suspense fallback gives the page a non-zero height while the Fold chunk
            loads, so users see the layout (and so scrollHeight is sane) even on
            slow networks. */}
        <Suspense fallback={<Flex width="100%" height={400} />}>
          <Rive />
          <Fold ref={scrollAnchor} />
        </Suspense>
      </FoldBoundary>
    </Flex>
  )
}

export default memo(LandingV2)
