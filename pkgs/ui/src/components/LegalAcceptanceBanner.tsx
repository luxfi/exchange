/**
 * LegalAcceptanceBanner — Unified regulatory + privacy + cookies + GDPR banner.
 *
 * One clean banner for all Lux ecosystem apps (exchange, bridge, explorer).
 * Shows once per user, stores acceptance in localStorage.
 * Does NOT show on docs/marketing sites.
 *
 * Covers:
 * - Experimental research software disclaimer
 * - Non-custodial protocol notice
 * - Digital commodity regulatory status
 * - Cookie/analytics consent (GDPR)
 * - Privacy policy acceptance
 * - Terms of service acceptance
 */

import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'protocol-legal-accepted'
const STORAGE_VERSION = '2026-03-25' // bump to re-show after major legal updates

export interface LegalAcceptanceBannerProps {
  /** Brand name for display — injected from runtime brand config */
  brandName?: string
  /** Terms of service URL */
  termsUrl?: string
  /** Privacy policy URL */
  privacyUrl?: string
  /** Regulatory status page URL */
  regulatoryUrl?: string
  /** Callback when user accepts */
  onAccept?: () => void
  /** Callback when user declines (optional — if not provided, decline is not shown) */
  onDecline?: () => void
  /** Custom class name for styling */
  className?: string
}

export function useLegalAcceptance() {
  const [accepted, setAccepted] = useState<boolean>(true) // default true to prevent flash

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored === STORAGE_VERSION) {
        setAccepted(true)
      } else {
        setAccepted(false)
      }
    } catch {
      setAccepted(false)
    }
  }, [])

  const accept = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, STORAGE_VERSION)
    } catch {
      // localStorage not available
    }
    setAccepted(true)
  }, [])

  return { accepted, accept }
}

export function LegalAcceptanceBanner({
  brandName = 'Protocol',
  termsUrl = '/terms',
  privacyUrl = '/privacy',
  regulatoryUrl = '/legal/regulatory-status',
  onAccept,
  className,
}: LegalAcceptanceBannerProps) {
  const { accepted, accept } = useLegalAcceptance()

  const handleAccept = useCallback(() => {
    accept()
    onAccept?.()
  }, [accept, onAccept])

  if (accepted) return null

  return (
    <div
      className={className}
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: 'rgba(0, 0, 0, 0.95)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '20px 24px',
        color: '#fff',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontSize: '13px',
        lineHeight: '1.5',
      }}
      role="dialog"
      aria-label="Legal and privacy notice"
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '12px' }}>
          <strong style={{ fontSize: '14px' }}>
            {brandName} — Experimental Research Software
          </strong>
        </div>

        <p style={{ margin: '0 0 8px 0', color: 'rgba(255, 255, 255, 0.7)' }}>
          This is experimental, open-source, decentralized protocol software provided &quot;as is&quot;
          without warranty. <strong style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
          We never have access to your private keys, funds, or assets.</strong>{' '}
          All transactions are executed directly by you on the blockchain and are irreversible.
          You use this software entirely at your own risk.
        </p>

        <p style={{ margin: '0 0 12px 0', color: 'rgba(255, 255, 255, 0.7)' }}>
          This interface uses minimal cookies for functionality and privacy-respecting analytics.
          By continuing, you agree to our{' '}
          <a href={termsUrl} target="_blank" rel="noopener noreferrer"
            style={{ color: 'var(--accent1, #7C3AED)', textDecoration: 'underline' }}>
            Terms of Service
          </a>{' '}and{' '}
          <a href={privacyUrl} target="_blank" rel="noopener noreferrer"
            style={{ color: 'var(--accent1, #7C3AED)', textDecoration: 'underline' }}>
            Privacy Policy
          </a>.{' '}
          <a href={regulatoryUrl} target="_blank" rel="noopener noreferrer"
            style={{ color: 'rgba(255, 255, 255, 0.5)', textDecoration: 'underline' }}>
            Regulatory Status
          </a>
        </p>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            onClick={handleAccept}
            style={{
              background: 'var(--accent1, #7C3AED)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 24px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'opacity 0.15s',
            }}
            onMouseOver={(e) => { (e.target as HTMLButtonElement).style.opacity = '0.85' }}
            onMouseOut={(e) => { (e.target as HTMLButtonElement).style.opacity = '1' }}
          >
            I Understand &amp; Accept
          </button>

          <span style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '12px' }}>
            Not legal, tax, or financial advice.
          </span>
        </div>
      </div>
    </div>
  )
}

export default LegalAcceptanceBanner
