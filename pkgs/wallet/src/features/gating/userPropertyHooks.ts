// User-property attachment for gating used to push ENS / unitag into the
// Statsig user context. With the SDK gone this is a no-op until the
// `@hanzo/insights` (PostHog) bridge lands and we wire `posthog.identify(...)`
// here instead.
export function useGatingUserPropertyUsernames(): void {}
