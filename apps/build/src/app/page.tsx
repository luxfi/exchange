import { Header } from '@/components/Header'
import { ValidatorDashboard } from './ValidatorDashboard'

export default function Home() {
  return (
    <div>
      <Header />
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>Validator Dashboard</h1>
        <p style={{ color: 'var(--muted)', marginBottom: 32 }}>
          Monitor validators, stake LUX, and manage delegation across the Lux network.
        </p>
        <ValidatorDashboard />
      </main>
    </div>
  )
}
