import { createRoot } from 'react-dom/client'
import Exchange from '@luxfi/exchange'

// Absolute minimum — no brand, no overrides. Serves a default Lux Exchange
// on Lux mainnet. Useful as a smoke test or as a starting skeleton.

createRoot(document.getElementById('root')!).render(<Exchange />)
