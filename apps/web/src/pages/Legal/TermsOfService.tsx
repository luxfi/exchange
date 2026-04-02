import { brand } from '@luxexchange/config'
import { LEGAL_UPDATED } from '@luxexchange/config/src/legal'

/**
 * Terms of Service page — served at /terms on all white-label deployments.
 * Brand name and entity are injected from runtime config. Zero hardcoded brands.
 */
export default function TermsOfService() {
  const name = brand.name || 'Exchange'
  const entity = brand.legalEntity || 'the protocol operator'

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px 80px', color: 'var(--neutral1, #fff)' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>Terms of Service</h1>
      <p style={{ color: 'var(--neutral2, #888)', marginBottom: '32px', fontSize: '14px' }}>
        Last Updated: {LEGAL_UPDATED}
      </p>

      <Section title="1. Overview">
        <p>
          These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of {name} and associated
          interfaces (the &ldquo;Interface&rdquo;) that provide access to the decentralized protocol
          (the &ldquo;Protocol&rdquo;). The Interface is provided by {entity} and its affiliates
          (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;).
        </p>
        <Banner>
          THE INTERFACE IS A FRONT-END TO A DECENTRALIZED PROTOCOL.{' '}
          {entity.toUpperCase()} DOES NOT CONTROL, OPERATE, OR MANAGE THE PROTOCOL ITSELF.
        </Banner>
      </Section>

      <Section title="2. Experimental Research Software">
        <Banner>
          THE INTERFACE AND THE PROTOCOL ARE EXPERIMENTAL RESEARCH SOFTWARE provided &ldquo;as is&rdquo;
          and &ldquo;as available&rdquo; for research, educational, and experimental purposes.
          YOU USE THIS SOFTWARE ENTIRELY AT YOUR OWN RISK.
        </Banner>
        <p>
          The software may contain bugs, errors, design flaws, or other defects. You acknowledge and accept
          the inherent risks including loss of funds due to smart contract vulnerabilities, user error,
          blockchain failures, MEV extraction, oracle manipulation, bridge failures, and other risks
          inherent to experimental blockchain software.
        </p>
      </Section>

      <Section title="3. Non-Custodial Protocol">
        <Banner>
          WE NEVER HAVE ACCESS TO, CUSTODY OF, OR CONTROL OVER YOUR ASSETS, PRIVATE KEYS,
          PASSWORDS, OR FUNDS AT ANY TIME.
        </Banner>
        <ul>
          <li><strong>Your keys, your assets.</strong> You are solely responsible for the security of your
            private keys and seed phrases. Lost keys cannot be recovered by anyone.</li>
          <li><strong>No custody.</strong> We do not hold, store, send, receive, or manage any digital
            assets on your behalf.</li>
          <li><strong>No control.</strong> We cannot freeze, seize, reverse, or modify any transaction.</li>
          <li><strong>No accounts.</strong> The Interface does not require user accounts. Your blockchain
            address is your identity.</li>
          <li><strong>MPC/threshold signatures.</strong> Where multi-party computation is used (e.g., bridge),
            no single party possesses the complete private key.</li>
        </ul>
      </Section>

      <Section title="4. Regulatory Status">
        <p>
          On March 17, 2026, the SEC and CFTC issued a joint interpretive release classifying certain
          digital assets as <strong>digital commodities</strong> not subject to federal securities law.
          Protocol staking (all four models), no-consideration airdrops, and protocol governance are
          classified as administrative activities outside the Howey test.
        </p>
        <p>
          The CLARITY Act (pending) would codify this classification permanently. The GENIUS Act (S. 394)
          establishes a federal stablecoin framework. See{' '}
          <a href="https://lps.lux.network/legal/regulatory-status" target="_blank" rel="noopener noreferrer">
            Regulatory Status
          </a>{' '}for details.
        </p>
        <Banner>
          NOTHING PROVIDED THROUGH THE INTERFACE CONSTITUTES LEGAL, TAX, INVESTMENT,
          FINANCIAL, OR OTHER ADVICE.
        </Banner>
      </Section>

      <Section title="5. Prohibited Uses">
        <p>You may NOT use the Interface to violate any applicable law, engage in market manipulation,
          circumvent economic sanctions (OFAC SDN, EU/UK/UN), launder money, or distribute malware.
          Security tokens require separate compliance under LP-3100.</p>
        <p>The Interface uses third-party screening (TRM Labs) to check wallet addresses against
          sanctions lists. The underlying Protocol is permissionless and cannot be restricted.</p>
      </Section>

      <Section title="6. Decentralized Protocol">
        <p>
          The Protocol is decentralized, open-source (BSD-3-Clause), and operates on independent
          validator nodes. No single entity controls it. If the Interface becomes unavailable, the
          Protocol continues operating and can be accessed via alternative interfaces or direct
          smart contract interaction.
        </p>
      </Section>

      <Section title="7. Assumption of Risk">
        <p>
          You acknowledge: blockchain technology is experimental; digital asset prices are volatile;
          regulatory status may change; software may have bugs; third-party protocols may fail;
          you are responsible for your tax obligations; digital assets are not insured by FDIC, SIPC,
          or any government program.
        </p>
      </Section>

      <Section title="8. Disclaimer of Warranties">
        <Banner>
          THE INTERFACE AND PROTOCOL ARE PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo;
          WITHOUT WARRANTIES OF ANY KIND. WE DISCLAIM ALL WARRANTIES INCLUDING MERCHANTABILITY,
          FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
        </Banner>
      </Section>

      <Section title="9. Limitation of Liability">
        <Banner>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
          SPECIAL, CONSEQUENTIAL, PUNITIVE, OR EXEMPLARY DAMAGES. TOTAL LIABILITY SHALL NOT EXCEED $100 USD.
        </Banner>
      </Section>

      <Section title="10. Indemnification">
        <p>
          You agree to indemnify and hold harmless {entity} from all claims arising from your use
          of the Interface or Protocol, your violation of these Terms or any law, and any transactions
          you execute.
        </p>
      </Section>

      <Section title="11. Governing Law">
        <p>
          These Terms are governed by the laws of the British Virgin Islands. Disputes shall be
          resolved by binding arbitration (ICDR). You waive any right to class action.
        </p>
      </Section>

      <Section title="12. International Use">
        <p>
          The Interface is available globally. Certain features may be unavailable in sanctioned
          jurisdictions (Cuba, Iran, North Korea, Syria, Crimea/Donetsk/Luhansk). You are responsible
          for compliance with your local laws.
        </p>
      </Section>

      <Section title="13. Staking Disclosure">
        <p>
          Staking is an administrative activity. Rewards are determined programmatically by protocol
          parameters. We do not manage or guarantee staking rewards. Risks include slashing,
          lock-up periods, and protocol changes.
        </p>
      </Section>

      <Section title="14. Modifications">
        <p>We may modify these Terms at any time. Continued use constitutes acceptance.</p>
      </Section>

      <p style={{ marginTop: '40px', color: 'var(--neutral3, #555)', fontSize: '12px', fontStyle: 'italic' }}>
        These Terms are published for informational purposes and do not constitute legal advice.
        The protocol is decentralized, open-source, experimental research software.
      </p>

      <p style={{ marginTop: '16px', color: 'var(--neutral3, #555)', fontSize: '12px' }}>
        Contact: legal@lux.network &bull; Compliance: compliance@lux.exchange
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
