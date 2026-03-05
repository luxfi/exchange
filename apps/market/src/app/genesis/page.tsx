import { Header } from '@/components/Header'

const GENESIS_TIERS = [
  {
    name: 'Genesis',
    lockedLux: '1,000,000,000',
    description:
      'The pinnacle of the Lux Genesis Collection. Each Genesis NFT permanently locks 1 billion LUX, with all staking rewards flowing directly to the holder.',
    maxSupply: 10,
    rewardMultiplier: '10x',
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
  },
  {
    name: 'Validator',
    lockedLux: '100,000,000',
    description:
      'Validator-tier Genesis NFTs lock 100M LUX permanently. Holders receive validator staking rewards through the ValidatorVault and LiquidLUX (xLUX) system.',
    maxSupply: 100,
    rewardMultiplier: '5x',
    gradient: 'linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #2d1b69 100%)',
  },
  {
    name: 'Mini',
    lockedLux: '10,000,000',
    description:
      'Mini Genesis NFTs lock 10M LUX permanently. A more accessible entry point to Genesis rewards with proportional staking returns.',
    maxSupply: 1000,
    rewardMultiplier: '2x',
    gradient: 'linear-gradient(135deg, #1a0f2e 0%, #2d1654 50%, #1a1a3e 100%)',
  },
  {
    name: 'Nano',
    lockedLux: '1,000,000',
    description:
      'Nano Genesis NFTs lock 1M LUX permanently. The most accessible Genesis tier, providing base-level staking rewards to holders.',
    maxSupply: 10000,
    rewardMultiplier: '1x',
    gradient: 'linear-gradient(135deg, #0f1a2e 0%, #1a2d4e 50%, #0f2040 100%)',
  },
]

export default function GenesisPage() {
  return (
    <div>
      <Header />
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        <section style={{ textAlign: 'center', marginBottom: 48 }}>
          <h1 style={{ fontSize: 40, fontWeight: 700, marginBottom: 12 }}>Genesis NFTs</h1>
          <p style={{ fontSize: 16, color: 'var(--muted)', maxWidth: 600, margin: '0 auto' }}>
            Permanently locked LUX tokens with staking rewards flowing to NFT holders. Genesis NFTs control validator
            staking returns through the ValidatorVault and LiquidLUX (xLUX) system.
          </p>
        </section>

        {/* Reward flow diagram */}
        <section
          style={{
            background: 'var(--card)',
            borderRadius: 12,
            border: '1px solid var(--border)',
            padding: 24,
            marginBottom: 48,
            textAlign: 'center',
          }}
        >
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Reward Flow</h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 14 }}>Validator Staking</span>
            <span style={{ color: 'var(--muted)' }}>&rarr;</span>
            <span style={{ fontSize: 14 }}>ValidatorVault.depositRewards()</span>
            <span style={{ color: 'var(--muted)' }}>&rarr;</span>
            <span style={{ fontSize: 14 }}>LiquidLUX.depositValidatorRewards()</span>
            <span style={{ color: 'var(--muted)' }}>&rarr;</span>
            <span style={{ fontSize: 14, fontWeight: 600 }}>xLUX holders</span>
          </div>
        </section>

        {/* Tier grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
          {GENESIS_TIERS.map((tier) => (
            <div
              key={tier.name}
              style={{
                background: 'var(--card)',
                borderRadius: 16,
                overflow: 'hidden',
                border: '1px solid var(--border)',
              }}
            >
              <div
                style={{
                  aspectRatio: '4/3',
                  background: tier.gradient,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <span
                  style={{
                    fontSize: 12,
                    color: 'var(--muted)',
                    textTransform: 'uppercase',
                    letterSpacing: 2,
                  }}
                >
                  Genesis
                </span>
                <span style={{ fontSize: 36, fontWeight: 700 }}>{tier.name}</span>
                <span style={{ fontSize: 14, color: 'var(--accent)' }}>{tier.rewardMultiplier} rewards</span>
              </div>
              <div style={{ padding: '20px' }}>
                <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 4 }}>Permanently Locked</div>
                <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>{tier.lockedLux} LUX</div>
                <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5, marginBottom: 16 }}>
                  {tier.description}
                </p>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: 13,
                    color: 'var(--muted)',
                    borderTop: '1px solid var(--border)',
                    paddingTop: 12,
                  }}
                >
                  <span>Max Supply: {tier.maxSupply.toLocaleString()}</span>
                  <span>Rewards: {tier.rewardMultiplier}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
