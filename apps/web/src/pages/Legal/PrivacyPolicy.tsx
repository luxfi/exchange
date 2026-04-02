import { brand } from '@luxexchange/config'
import { LEGAL_UPDATED } from '@luxexchange/config/src/legal'

/**
 * Privacy Policy page — served at /privacy on all Lux ecosystem apps.
 */
export default function PrivacyPolicyPage() {
  const name = brand.name || 'Exchange'
  const entity = brand.legalEntity || 'the protocol operator'

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px 80px', color: 'var(--neutral1, #fff)' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>Privacy Policy</h1>
      <p style={{ color: 'var(--neutral2, #888)', marginBottom: '32px', fontSize: '14px' }}>
        Last Updated: {LEGAL_UPDATED}
      </p>

      <Section title="1. Introduction">
        <p>
          This Privacy Policy describes how {entity} (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;)
          collects, uses, and shares information when you use {name} and associated interfaces.
        </p>
        <Banner>
          THE LUX NETWORK PROTOCOL IS DECENTRALIZED AND NON-CUSTODIAL. WE DO NOT COLLECT,
          STORE, OR HAVE ACCESS TO YOUR PRIVATE KEYS, SEED PHRASES, WALLET PASSWORDS,
          OR THE CONTENTS OF YOUR WALLET.
        </Banner>
      </Section>

      <Section title="2. Information We Do NOT Collect">
        <ul>
          <li><strong>Private keys, seed phrases, or wallet passwords.</strong> Never. We have zero access.</li>
          <li><strong>User accounts.</strong> No registration required. Your blockchain address is pseudonymous.</li>
          <li><strong>Your funds or assets.</strong> All assets remain in your self-custody wallet or
            decentralized smart contracts.</li>
          <li><strong>Your transactions.</strong> We cannot reverse, modify, or cancel blockchain transactions.</li>
          <li><strong>Financial information.</strong> No bank accounts, credit cards, or SSNs.</li>
        </ul>
      </Section>

      <Section title="3. Information We May Collect">
        <h3 style={{ fontSize: '15px', fontWeight: 600, marginTop: '12px' }}>Automatically Collected</h3>
        <ul>
          <li><strong>Public blockchain data.</strong> Your public address and transactions are on a public ledger
            visible to everyone — not &ldquo;collected&rdquo; by us.</li>
          <li><strong>Device/usage info.</strong> Browser type, OS, screen size, language, pages visited.
            Collected via privacy-respecting analytics (Hanzo Insights). Does not identify you personally.</li>
          <li><strong>IP address.</strong> Temporarily processed for DDoS/rate-limiting. Not stored long-term
            or linked to wallet addresses.</li>
          <li><strong>Cookies/local storage.</strong> Functional only (theme, language, slippage).
            No tracking cookies. No behavioral profiling.</li>
        </ul>

        <h3 style={{ fontSize: '15px', fontWeight: 600, marginTop: '12px' }}>Wallet Address Screening</h3>
        <p>
          We use third-party services (TRM Labs) to screen wallet addresses against global sanctions
          lists (OFAC, EU/UK) when you connect your wallet. Only your public wallet address is sent.
          No personal data, private keys, or transaction details are shared. The underlying Protocol
          is permissionless and cannot be restricted.
        </p>
      </Section>

      <Section title="4. How We Use Information">
        <p>We use collected information for: operating the Interface, security (DDoS, sanctions screening),
          aggregate analytics, legal compliance, and responding to support inquiries you initiate.</p>
        <p><strong>We do NOT:</strong> sell data, serve targeted ads, build user profiles, or conduct
          behavioral profiling.</p>
      </Section>

      <Section title="5. How We Share Information">
        <p>We do NOT sell personal information. We may share with: infrastructure providers under contract,
          sanctions screening providers (public wallet address only), and when required by law.</p>
      </Section>

      <Section title="6. On-Chain Data">
        <Banner>
          All blockchain transactions are publicly visible and permanently recorded. This includes
          amounts, addresses, timestamps, and smart contract interactions. This data cannot be deleted
          by anyone. Assume all on-chain activity is permanent.
        </Banner>
      </Section>

      <Section title="7. Data Retention">
        <ul>
          <li>Analytics: aggregate, purged after 90 days</li>
          <li>IP addresses: not stored long-term</li>
          <li>Support communications: retained for resolution + legal compliance</li>
          <li>On-chain data: permanent, immutable, not deletable by any party</li>
        </ul>
      </Section>

      <Section title="8. Your Rights">
        <ul>
          <li><strong>Analytics opt-out:</strong> Via Privacy Choices menu in the Interface</li>
          <li><strong>Cookie management:</strong> Via browser settings</li>
          <li><strong>Wallet disconnection:</strong> Disconnect at any time</li>
          <li><strong>Do Not Track:</strong> Respected — disables non-essential analytics</li>
          <li><strong>GDPR (EEA/UK):</strong> Access, rectification, erasure, portability rights apply.
            Given minimal data collection, most rights are satisfied by default. Contact privacy@lux.network.</li>
          <li><strong>CCPA (California):</strong> We do not sell personal information or use it for
            cross-context behavioral advertising.</li>
        </ul>
      </Section>

      <Section title="9. Security">
        <p>
          We implement reasonable security measures. However, no system is 100% secure. The primary
          security of your assets depends on your private key management. Blockchain transactions
          are irreversible.
        </p>
      </Section>

      <Section title="10. Children">
        <p>
          The Interface is not directed to persons under 18. We do not knowingly collect information
          from children.
        </p>
      </Section>

      <Section title="11. International Users">
        <p>
          Information may be processed in the United States and other countries. By using the Interface,
          you consent to cross-border data transfer.
        </p>
      </Section>

      <Section title="12. Changes">
        <p>We may update this policy. Changes posted with updated date. Continued use = acceptance.</p>
      </Section>

      <p style={{ marginTop: '40px', color: 'var(--neutral3, #555)', fontSize: '12px', fontStyle: 'italic' }}>
        This Privacy Policy is published for informational purposes. The protocol is
        decentralized, open-source, experimental research software. The Protocol is permissionless —
        no entity can restrict access to or control the Protocol itself.
      </p>

      <p style={{ marginTop: '16px', color: 'var(--neutral3, #555)', fontSize: '12px' }}>
        Contact: privacy@lux.network &bull; Legal: legal@lux.network
      </p>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '28px' }}>
      <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '12px' }}>{title}</h2>
      <div style={{ fontSize: '14px', lineHeight: '1.7', color: 'var(--neutral2, #aaa)' }}>{children}</div>
    </div>
  )
}

function Banner({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: 'var(--surface2, rgba(255,255,255,0.05))',
        border: '1px solid var(--surface3, rgba(255,255,255,0.1))',
        borderRadius: '8px',
        padding: '12px 16px',
        margin: '12px 0',
        fontSize: '13px',
        fontWeight: 600,
        lineHeight: '1.6',
        color: 'var(--neutral1, #fff)',
      }}
    >
      {children}
    </div>
  )
}
