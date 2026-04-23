// Config-driven sign-up gate for white-label deployments.
//
// Reads /config.json (templated by hanzoai/spa from SPA_* env vars at pod
// startup). If neither `idHost` nor `onboardingUrl` is present, renders
// nothing — the default on brands that don't run an identity stack
// (flagship Lux + Zoo swaps sit in this bucket today).
//
// Opt-in per deployment:
//   SPA_ID_HOST=https://id.example.com          → Sign Up button →
//     ${idHost}/signup?return=<current-url>
//   SPA_ONBOARDING_URL=https://foo/onboard      → Sign Up button →
//     exact URL; `onboardingUrl` wins over `idHost` when both are set.
//
// Intentionally minimal: no user-store dependency, no "are they already
// signed in" logic — downstream tenants (e.g. Liquidity) that need KYC
// status gating layer it on top by wrapping this component. Upstream
// ships the framework-agnostic primitive.
import { getRuntimeConfig } from '@l.x/config'
import { useTranslation } from 'react-i18next'
import { Button } from '@l.x/ui/src'
import { ElementName } from '@l.x/lx/src/features/telemetry/constants'
import { Trace } from '@l.x/lx/src/features/telemetry/Trace'

function resolveTarget(idHost?: string, onboardingUrl?: string): string | null {
  if (onboardingUrl) return onboardingUrl
  if (!idHost) return null
  const ret = typeof window !== 'undefined' ? window.location.href : ''
  return `${idHost}/signup?return=${encodeURIComponent(ret)}`
}

export function OnboardingGate(): JSX.Element | null {
  const { t } = useTranslation()
  const { idHost, onboardingUrl } = getRuntimeConfig()
  const target = resolveTarget(idHost, onboardingUrl)
  if (!target) return null

  return (
    <Trace logPress element={ElementName.SignIn}>
      <Button
        fill={false}
        size="small"
        emphasis="secondary"
        variant="branded"
        onPress={() => {
          window.location.href = target
        }}
      >
        {t('nav.signUp.button', { defaultValue: 'Sign Up' })}
      </Button>
    </Trace>
  )
}
